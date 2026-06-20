import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const workspaceFile = resolve(process.cwd(), 'pnpm-workspace.yaml')
const allowEntry =
  '  audiobuffer-to-wav@https://codeload.github.com/torch2424/audiobuffer-to-wav/tar.gz/8878a20c5cc7e457b113dabfb1781ad4178f9c62: true'

const text = readFileSync(workspaceFile, 'utf8')

if (text.includes('audiobuffer-to-wav')) {
  process.exit(0)
}

if (!text.includes('allowBuilds:')) {
  console.error('pnpm-workspace.yaml: allowBuilds block not found')
  process.exit(1)
}

writeFileSync(
  workspaceFile,
  text.replace(
    '  unrs-resolver: true\n',
    `  unrs-resolver: true\n${allowEntry}\n`,
  ),
)
