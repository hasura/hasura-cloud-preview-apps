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
  if (exists) {
    context.logger.log(
      'A project with the given name exists. Triggering redeployment.'
    )
    const recreateResp = await recreatePreviewApp(context)
    context.logger.log(`Redeployed:\n${JSON.stringify(recreateResp, null, 2)}`)
    context.logger.log(`Applying metadata and migrations from the branch...`)
    const jobStatus = await getRealtimeLogs(
      recreateResp.githubDeploymentJobID,
      context
    )
    if (jobStatus === 'failed') {
      context.logger.log(
        'Preview app has been created, but applying metadata and migrations failed'
      )
    }
    return getOutputVars(recreateResp, context.parameters)
  } else {
    context.logger.log('Creating Hasura Cloud preview app.')
    const createResp = await createPreviewApp(context)
    context.logger.log(`Deployed:\n${JSON.stringify(createResp, null, 2)}`)
    context.logger.log(`Applying metadata and migrations from the branch...`)

    const jobStatus = await getRealtimeLogs(
      createResp.githubDeploymentJobID,
      context
    )
    if (jobStatus === 'failed') {
      context.logger.log(
        'Preview app has been created, but applying metadata and migrations failed'
      )
    }
    return getOutputVars(createResp, context.parameters)
  }
}
