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
 * Meta commands are special instructions that start with a dot (.exit, .tables) the user inputs
 * They're not SQL, they're instructions to the database itself
 */
enum MetaCommandResult {
  Success,
  UnrecognizedCommand,
}

/**
 * Meta-command handling (.exit, etc.) Right now it just checks for .exit but in the future you'll add
 * things like .tables here25
 */
function doMetaCommand(input: InputBuffer): MetaCommandResult {
  if (input.buffer === '.exit') {
    console.log('Bye!')
    process.exit(0)
  }

  return MetaCommandResult.UnrecognizedCommand
}

/**
 * Statements for SQL (Clauses like Insert and Select)
 */

enum StatementType {
  Insert,
  Select,
}

interface Statement {
  type: StatementType
}

/**
 * Prepare SQL compiler
 */

enum PreparedResult {
  Success,
  UnrecognizedStatement,
}

function prepareStatement(input: InputBuffer): {
  result: PreparedResult
  statement?: Statement
} {
  if (input.buffer.startsWith('insert')) {
    return {
      result: PreparedResult.Success,
      statement: { type: StatementType.Insert },
    }
  }

  if (input.buffer === 'select') {
    return {
      result: PreparedResult.Success,
      statement: { type: StatementType.Select },
    }
  }

  return { result: PreparedResult.UnrecognizedStatement }
}

// Execute (The virtual machine)

function executeStatement(statement: Statement): void {
  switch (statement.type) {
    case StatementType.Insert:
      console.log('This is a temp placeholder where we would do an insert')
      break
    case StatementType.Select:
      console.log('This is a temp placeholder where we would do an select')
      break
  }
}

// Creation of the REPL (Read Execute Print Loop)

function printPrompt(): void {
  process.stdout.write('db > ')
}

// Current flow through the REPL now is: user input → doMetaCommand OR prepareStatement → executeStatement
function startRepl(): void {
  const inputBuffer = newInputBuffer()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false, // avoids the users ability to remove prompt
  })

  printPrompt()

  rl.on('line', (line: string) => {
    inputBuffer.buffer = line.trim()

    if (inputBuffer.buffer.startsWith('.')) {
      const result = doMetaCommand(inputBuffer)
      switch (result) {
        case MetaCommandResult.Success:
          printPrompt()
          return
        case MetaCommandResult.UnrecognizedCommand:
          console.log(`Unrecongized command ${inputBuffer.buffer}`)
          printPrompt()
          return
      }
    }

    // Prepare the statement and execute it with a switch case
    const { result, statement } = prepareStatement(inputBuffer)

    switch (result) {
      case PreparedResult.Success:
        executeStatement(statement!)
        console.log('Executed')
        printPrompt()
        break
      case PreparedResult.UnrecognizedStatement:
        console.log(`Unrecognized keyword at start of ${inputBuffer.buffer}`)
        printPrompt()
        break
    }
  })

  rl.on('close', () => {
    process.exit(0)
  })
}

startRepl()
