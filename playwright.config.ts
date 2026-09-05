import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import os from 'os'

function loadEnvFile(fileName: string) {
  const filePath = path.resolve(__dirname, fileName)
  if (!fs.existsSync(filePath)) return
  for (const raw of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 1) continue
    const key = line.slice(0, eq).trim()
    const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvFile('.env.e2e.local')

const home = process.env.HOME || os.homedir()
const defaultBrowsersPath = path.join(home, 'Library/Caches/ms-playwright')
// Cursor sandbox redirects PLAYWRIGHT_BROWSERS_PATH to an empty cache; prefer the real install.
if (
  !process.env.PLAYWRIGHT_BROWSERS_PATH ||
  process.env.PLAYWRIGHT_BROWSERS_PATH.includes('cursor-sandbox-cache')
) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = defaultBrowsersPath
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

const HEADLESS_SHELL_CANDIDATES = [
  process.env.PLAYWRIGHT_CHROME_PATH,
  path.join(
    home,
    'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell',
  ),
  path.join(
    home,
    'Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell',
  ),
].filter(Boolean) as string[]

const executablePath = HEADLESS_SHELL_CANDIDATES.find((p) => fs.existsSync(p))

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 120_000,
  expect: { timeout: 15_000 },
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...(executablePath
      ? { executablePath }
      : { channel: (process.env.PLAYWRIGHT_CHANNEL || 'chrome') as 'chrome' }),
  },
  projects: [{ name: 'chromium' }],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
