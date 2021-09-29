import {handler} from './handler'
import {createContext} from './context'
import {createLogger} from './logger'
import {errors} from './errors'

const run = async (context): Promise<void> => {
  try {
    const outputVars: Record<string, string> = await handler(context)
    const outputVarKeys = Object.keys(outputVars)
    for (let i = 0; i < outputVarKeys.length; i++) {
      context.logger.output(outputVarKeys[i], outputVars[outputVarKeys[i]])
    }
  } catch (error) {
    if (error instanceof Error) {
      context.logger.terminate(error.message)
    } else {
      context.logger.terminate(errors.unexpected)
    }
    process.exit(1)
  }
}

const logger = createLogger()
try {
  const context = createContext()
  run(context)
} catch (e) {
  if (e instanceof Error) {
    logger.terminate(e.message)
  } else {
    logger.terminate(errors.unexpected)
  }
  process.exit(1)
}
