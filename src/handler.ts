import {Parameters} from './parameters'
import {OutputVars} from './types'
import {
  doesProjectExist,
  createPreviewApp,
  recreatePreviewApp
} from './previewApps'
import {createGqlClient} from './client'

export const handler = async (parameters: Parameters): Promise<OutputVars> => {
  console.log(parameters)
  const client = createGqlClient(parameters)
  const exists = await doesProjectExist(parameters.NAME, client)
  console.log(exists)
  if (exists) {
    const recreateResp = await recreatePreviewApp(parameters, client)
    console.log(recreateResp)
  } else {
    const createResp = await createPreviewApp(parameters, client)
    console.log(createResp)
  }
  return {
    graphQLEndpoint: 'fkld',
    consoleURL: 'af',
    jobId: 'something'
  }
}
