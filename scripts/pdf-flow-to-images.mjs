#!/usr/bin/env node
/**
 * Convert a flow PDF to PNG pages for reference / visual regression.
 *
 * Usage:
 *   node scripts/pdf-flow-to-images.mjs [pdfPath] [outputDir]
 *
 * Requires poppler-utils: sudo apt install poppler-utils
 *
 * Default: flows/sales-flow.pdf → e2e/docs/sales-flow/
 */
import { execSync, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const pdfPath = path.resolve(root, process.argv[2] || 'flows/sales-flow.pdf')
const outDir = path.resolve(root, process.argv[3] || 'e2e/docs/sales-flow')

if (!fs.existsSync(pdfPath)) {
  console.error(`PDF not found: ${pdfPath}`)
  console.error('Expected flows/sales-flow.pdf (see flows/README.md).')
  process.exit(1)
}

const hasPdftoppm = spawnSync('which', ['pdftoppm'], { encoding: 'utf8' }).status === 0
if (!hasPdftoppm) {
  console.error('pdftoppm not found. Install poppler-utils (e.g. apt install poppler-utils).')
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })
const prefix = path.join(outDir, 'page')
console.log(`Converting ${pdfPath} → ${outDir}/page-*.png`)
execSync(`pdftoppm -png -r 150 "${pdfPath}" "${prefix}"`, { stdio: 'inherit', cwd: root })

const images = fs.readdirSync(outDir).filter((f) => f.endsWith('.png')).sort()
console.log(`Done. ${images.length} page(s):`)
for (const f of images) console.log(`  ${path.join(outDir, f)}`)
