import * as readline from 'readline'

// Container for whatever the user inputs

interface InputBuffer {
  buffer: string
}

function newInputBuffer(): InputBuffer {
  return { buffer: '' }
}

/**
 * Represents what happens when you tried to run a "meta command".
 * Meta commands are special instructions that start with a dot (.exit, .tables)
 * They're not SQL, they're instructions to the database itself
 */
enum MetaCommandResult {
  Success,
  UnrecognizedCommand,
}

/**
 * Meta-command handling (.exit, etc.) Right now it just checks for .exit but in the future you'll add
 * things like .tables here
 */
function doMetaCommand(input: InputBuffer): MetaCommandResult {
  if (input.buffer === '.exit') {
    console.log('Bye!')
    process.exit(0)
  }

  return MetaCommandResult.UnrecognizedCommand
}

// Creation of the REPL (Read Execute Print Loop)

function printPrompt(): void {
  process.stdout.write('db > ')
}

function startRepl(): void {
  const inputBuffer = newInputBuffer()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  printPrompt()

  rl.on('line', (line: string) => {
    inputBuffer.buffer = line.trim()

    if (inputBuffer.buffer.startsWith('.')) {
      const result = doMetaCommand(inputBuffer)
      if (result === MetaCommandResult.UnrecognizedCommand) {
        console.log(`Unrecongized command ${inputBuffer.buffer}`)
      }
      printPrompt()
      return
    }

    console.log(`Unrecongized command ${inputBuffer.buffer}`)
    printPrompt()
  })

  rl.on('close', () => {
    process.exit(0)
  })
}

startRepl()
