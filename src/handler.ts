import {Parameters} from './parameters'
import {OutputVars} from './types'
import {doesProjectExist} from './previewApps'
import {createGqlClient} from './client'

export const handler = async (parameters: Parameters): Promise<OutputVars> => {
  const client = createGqlClient(parameters)
  const exists = await doesProjectExist(parameters.NAME, client)
  console.log(exists)
  return {
    graphQLEndpoint: 'fkld',
    consoleURL: 'af',
    jobId: 'something'
  }
}
