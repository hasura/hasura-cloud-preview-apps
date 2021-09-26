import fetch from 'node-fetch'
import {Parameters} from './parameters'

export const createGqlClient = (parameters: Parameters) => {
  const query = async <QueryResponseType, VariablesType>(opts: {
    query: string
    variables?: VariablesType
  }): Promise<QueryResponseType> => {
    const respRaw = await fetch(parameters.CLOUD_DATA_GRAPHQL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `pat ${parameters.HASURA_CLOUD_PAT}`
      },
      body: JSON.stringify({query: opts.query, variables: opts.variables})
    })
    const result: any = await respRaw.json()
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'unexpected graphql error')
    }
    return result.data as QueryResponseType
  }
  return {
    query
  }
}

export type Client = ReturnType<typeof createGqlClient>
