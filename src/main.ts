import {handler} from './handler'
import {createContext, Context} from './context'
import {createLogger} from './logger'
import {errors} from './errors'

export const run = async (context: Context): Promise<void> => {
  try {
    const outputVars: Record<string, string> = await handler(context)
    const outputVarKeys = Object.keys(outputVars)
    for (const outputVarKey of outputVarKeys) {
      context.logger.output(outputVarKey, outputVars[outputVarKey])
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

createContext()
  .then(context => {
    run(context)
  })
  .catch(e => {
    const logger = createLogger()
    if (e instanceof Error) {
      logger.terminate(e.message)
    } else {
      logger.terminate(errors.unexpected)
    }
    process.exit(1)
  })
