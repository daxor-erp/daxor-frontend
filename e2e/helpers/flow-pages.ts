import { expect, type Page } from '@playwright/test'

/** Navigate and assert a module page loads (heading visible). */
export async function smokeModulePage(
  page: Page,
  href: string,
  heading: RegExp,
) {
  await page.goto(href)
  await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible({
    timeout: 25_000,
  })
}

function pageErrorSnippet(page: Page): Promise<string> {
  return page.evaluate(() => {
    const body = document.body?.innerText?.slice(0, 400) ?? ''
    return body.replace(/\s+/g, ' ').trim()
  })
}

/**
 * Soft smoke: page must stay authenticated, render app chrome, and not show a
 * fatal Next.js / runtime error. Clear label: [frontend:group/name] href — reason
 */
export async function assertModulePageLoads(
  page: Page,
  href: string,
  label?: string,
) {
  const tag = label ? `[frontend:${label}]` : `[frontend]`
  const consoleErrors: string[] = []
  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  }
  page.on('console', onConsole)

  try {
    const response = await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 45_000 })
    const url = page.url()

    if (/\/login(?:\?|$)/.test(url)) {
      throw new Error(`${tag} ${href} — redirected to login (auth/session failed). Final URL: ${url}`)
    }

    if (response && response.status() >= 500) {
      const snippet = await pageErrorSnippet(page)
      throw new Error(
        `${tag} ${href} — HTTP ${response.status()}. Body: ${snippet || '(empty)'}`,
      )
    }

    if (response && response.status() === 404) {
      throw new Error(`${tag} ${href} — HTTP 404 Not Found (route missing or unauthorized)`)
    }

    try {
      await expect(
        page.locator('main, [role="main"], nav, aside, [data-sidebar]').first(),
      ).toBeVisible({ timeout: 25_000 })
    } catch {
      const snippet = await pageErrorSnippet(page)
      throw new Error(
        `${tag} ${href} — app shell did not render. URL: ${page.url()}. Body: ${snippet || '(empty)'}`,
      )
    }

    const fatal = page.getByText(
      /Application error|Unhandled Runtime Error|Internal Server Error|This page could not be found|Something went wrong/i,
    )
    const fatalCount = await fatal.count()
    if (fatalCount > 0) {
      const text = (await fatal.first().innerText().catch(() => '')).slice(0, 200)
      throw new Error(`${tag} ${href} — fatal UI error visible: ${text}`)
    }

    // GraphQL/network errors often surface as toast or red alert text
    const gqlToast = page.getByText(/GraphQL error|Failed to fetch|Network error|Unauthorized/i)
    if ((await gqlToast.count()) > 0) {
      const text = (await gqlToast.first().innerText().catch(() => '')).slice(0, 200)
      throw new Error(`${tag} ${href} — API/client error on page: ${text}`)
    }

    const severe = consoleErrors.filter(
      (t) =>
        /chunk load|hydration|uncaught|typeerror|referenceerror|graphql/i.test(t) &&
        !/favicon|ResizeObserver|Download the React DevTools/i.test(t),
    )
    if (severe.length) {
      throw new Error(
        `${tag} ${href} — browser console errors:\n  - ${severe.slice(0, 5).join('\n  - ')}`,
      )
    }
  } finally {
    page.off('console', onConsole)
  }
}
