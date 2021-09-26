import fetch from 'node-fetch'

export const createGqlClient = (endpoint: string, token: string) => {
  const query = async <QueryResponseType, VariablesType>(opts: {
    query: string
    variables?: VariablesType
  }): Promise<QueryResponseType> => {
  	const respRaw = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `pat ${token}`
      },
      body: JSON.stringify({query: opts.query, variables: opts.variables})
    });
    const result: any = await respRaw.json();
    if (result.errors) {
      throw new Error(
        result.errors[0]?.message || 'unexpected graphql error'
      )
    }
    return result.data as QueryResponseType
  }
  return {
    query
  }
}