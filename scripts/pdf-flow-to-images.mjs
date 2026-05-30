#!/usr/bin/env node
/**
 * Convert flow PDF(s) to PNG pages for reference / visual regression.
 *
 * Usage:
 *   node scripts/pdf-flow-to-images.mjs              # all PDFs in flows/
 *   node scripts/pdf-flow-to-images.mjs --all        # same
 *   node scripts/pdf-flow-to-images.mjs flows/crm-flow.pdf e2e/docs/crm-flow
 *
 * Requires poppler-utils: sudo apt install poppler-utils
 */
import { execSync, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const flowsDir = path.join(root, 'flows')

const hasPdftoppm = spawnSync('which', ['pdftoppm'], { encoding: 'utf8' }).status === 0
if (!hasPdftoppm) {
  console.error('pdftoppm not found. Install poppler-utils (e.g. apt install poppler-utils).')
  process.exit(1)
}

function convertOne(pdfPath, outDir) {
  if (!fs.existsSync(pdfPath)) {
    console.error(`PDF not found: ${pdfPath}`)
    return false
  }
  fs.mkdirSync(outDir, { recursive: true })
  for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith('.png')) fs.unlinkSync(path.join(outDir, f))
  }
  const prefix = path.join(outDir, 'page')
  console.log(`Converting ${pdfPath} → ${outDir}/page-*.png`)
  execSync(`pdftoppm -png -r 150 "${pdfPath}" "${prefix}"`, { stdio: 'inherit', cwd: root })
  const images = fs.readdirSync(outDir).filter((f) => f.endsWith('.png')).sort()
  console.log(`  ${images.length} page(s)`)
  return true
}

const args = process.argv.slice(2).filter((a) => a !== '--all')
const convertAll = args.length === 0 || process.argv.includes('--all')

if (convertAll) {
  const pdfs = fs
    .readdirSync(flowsDir)
    .filter((f) => f.endsWith('.pdf'))
    .sort()
  if (!pdfs.length) {
    console.error(`No PDFs in ${flowsDir}`)
    process.exit(1)
  }
  let ok = 0
  for (const name of pdfs) {
    const base = name.replace(/\.pdf$/i, '')
    const pdfPath = path.join(flowsDir, name)
    const outDir = path.join(root, 'e2e', 'docs', base)
    if (convertOne(pdfPath, outDir)) ok += 1
  }
  console.log(`Done. ${ok}/${pdfs.length} flow PDF(s) converted.`)
} else {
  const pdfPath = path.resolve(root, args[0])
  const outDir = path.resolve(root, args[1] || `e2e/docs/${path.basename(pdfPath, '.pdf')}`)
  if (!convertOne(pdfPath, outDir)) process.exit(1)
}
