import {createLogger, Logger} from './logger'
import {getParameters, Parameters} from './parameters'
import {createGqlClient, Client} from './client'

export type Context = {
  logger: Logger
  parameters: Parameters
  client: Client
}

export const createContext = async (): Promise<Context> => {
  try {
    const logger = createLogger()
    const parameters = await getParameters(logger)
    const client = createGqlClient(parameters, logger)
    return {
      logger,
      parameters,
      client
    }
  } catch (e) {
    throw e
  }
}
