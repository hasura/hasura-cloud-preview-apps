import fetch from 'node-fetch'
import {Parameters} from './parameters'
import { Logger } from './logger'

export const createGqlClient = (parameters: Parameters, logger: Logger) => {
  const query = async <QueryResponseType, VariablesType>(opts: {
    query: string
    variables?: VariablesType
  }): Promise<QueryResponseType> => {

    try {
      logger.debug('Making GraphQL query to Hasura Cloud API...');
      const respRaw = await fetch(parameters.CLOUD_DATA_GRAPHQL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `pat ${parameters.HASURA_CLOUD_PAT}`
        },
        body: JSON.stringify({query: opts.query, variables: opts.variables})
      })
      logger.debug(`Received response: ${JSON.stringify(respRaw, null, 4)}`)
      logger.debug(`Getting response body JSON...`)
      const result: any = await respRaw.json()
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'unexpected graphql error')
      }
      logger.debug(`Response body JSON: ${JSON.stringify(result, null, 4)}`)
      return result.data as QueryResponseType
    } catch (e) {
      throw e
    }

  }
  return {
    query
  }
}

export type Client = ReturnType<typeof createGqlClient>
