import {createLogger} from './logger'
import {getParameters} from './parameters'
import {createGqlClient} from './client'

export const createContext = () => {
  try {
    const logger = createLogger()
    const parameters = getParameters()
    const client = createGqlClient(parameters)
    return {
      logger,
      parameters,
      client
    }
  } catch (e) {
    throw e
  }
}

export type Context = ReturnType<typeof createContext>
