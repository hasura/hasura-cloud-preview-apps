import {handler} from './handler'
import {createContext} from './context'

const run = async (): Promise<void> => {
  const context = createContext()
  try {
    const outputVars = await handler(context)
    const outputVarKeys = Object.keys(outputVars)
    for (let i = 0; i < outputVarKeys.length; i++) {
      context.logger.output(outputVarKeys[i], outputVars[outputVarKeys[i]])
    }
  } catch (error) {
    if (error instanceof Error) {
      context.logger.terminate(error.message)
    } else {
      context.logger.terminate('unexpected error occured')
    }
    process.exit(1);
  }
}

run()
