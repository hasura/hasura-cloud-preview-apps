import {Parameters} from './parameters'
import {OutputVars} from './types'
import {
  doesProjectExist,
  createPreviewApp,
  recreatePreviewApp
} from './previewApps'
import {getRealtimeLogs} from './tasks'
import {createGqlClient} from './client'
import {getOutputVars} from './utils'

export const handler = async (parameters: Parameters): Promise<OutputVars> => {
  console.log(parameters)
  const client = createGqlClient(parameters)
  const exists = await doesProjectExist(parameters.NAME, client)
  console.log(exists)
  if (exists) {
    const recreateResp = await recreatePreviewApp(parameters, client)
    console.log('Recreate resp=================')
    console.log(recreateResp)
    console.log('==============================')
    const jobStatus = await getRealtimeLogs(
      recreateResp.githubDeploymentJobID,
      client
    )
    if (jobStatus === 'failed') {
      console.error(
        'Preview app has been created, but applying metadata and migrations failed'
      )
    }
    return getOutputVars(parameters, recreateResp)
  } else {
    const createResp = await createPreviewApp(parameters, client)
    console.log('Create resp=================')
    console.log(createResp)
    console.log('============================')
    const jobStatus = await getRealtimeLogs(
      createResp.githubDeploymentJobID,
      client
    )
    if (jobStatus === 'failed') {
      console.error(
        'Preview app has been created, but applying metadata and migrations failed'
      )
    }
    return getOutputVars(parameters, createResp)
  }
}
