#!/usr/bin/env node

import { status } from './commands/status.js'
import { update } from './commands/update.js'

const args = process.argv.slice(2)
const command = args[0]
const flags = new Set(args.slice(1))

switch (command) {
  case 'update':
    await update({ force: flags.has('--force') })
    break
  case 'status':
    await status()
    break
  default:
    console.log(`Usage: 300-harness <command>

Commands:
  update [--force]  Sync skills, hooks, and config files
  status            Show current harness state`)
    process.exit(command ? 1 : 0)
}
