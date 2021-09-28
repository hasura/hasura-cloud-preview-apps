import {Context} from './context'
import {OutputVars} from './types'
import {
  doesProjectExist,
  createPreviewApp,
  recreatePreviewApp
} from './previewApps'
import {getRealtimeLogs} from './tasks'
import {getOutputVars} from './utils'

export const handler = async (context: Context): Promise<OutputVars> => {
  const exists = await doesProjectExist(context)
  console.log(exists)
  if (exists) {
    const recreateResp = await recreatePreviewApp(context)
    console.log('Recreate resp=================')
    console.log(recreateResp)
    console.log('==============================')
    const jobStatus = await getRealtimeLogs(
      recreateResp.githubDeploymentJobID,
      context
    )
    if (jobStatus === 'failed') {
      console.error(
        'Preview app has been created, but applying metadata and migrations failed'
      )
    }
    return getOutputVars(recreateResp, context.parameters)
  } else {
    const createResp = await createPreviewApp(context)
    console.log('Create resp=================')
    console.log(createResp)
    console.log('============================')
    const jobStatus = await getRealtimeLogs(
      createResp.githubDeploymentJobID,
      context
    )
    if (jobStatus === 'failed') {
      console.error(
        'Preview app has been created, but applying metadata and migrations failed'
      )
    }
    return getOutputVars(createResp, context.parameters)
  }
}
