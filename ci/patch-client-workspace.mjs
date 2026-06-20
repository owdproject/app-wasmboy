import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fragmentPath = resolve(appRoot, 'playground/pnpm-workspace.yaml')
const workspaceFile = resolve(process.cwd(), 'pnpm-workspace.yaml')

const fragment = readFileSync(fragmentPath, 'utf8')
const clientText = readFileSync(workspaceFile, 'utf8')

const allowMatch = fragment.match(/^allowBuilds:\n((?:  .+\n?)+)/m)
if (!allowMatch) {
  console.error('playground/pnpm-workspace.yaml: allowBuilds block not found')
  process.exit(1)
}

const entries = allowMatch[1]
  .split('\n')
  .map(line => line.trimEnd())
  .filter(line => line.trim())

if (!clientText.includes('allowBuilds:')) {
  console.error('client pnpm-workspace.yaml: allowBuilds block not found')
  process.exit(1)
}

let next = clientText
for (const entry of entries) {
  const key = entry.replace(/: true$/, '').trim()
  if (next.includes(key)) {
    continue
  }
  next = next.replace(
    /^(\s*unrs-resolver: true\s*)$/m,
    `$1\n${entry}`,
  )
}

if (next === clientText) {
  process.exit(0)
}

writeFileSync(workspaceFile, next.endsWith('\n') ? next : `${next}\n`)
