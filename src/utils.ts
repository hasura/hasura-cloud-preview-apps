import {Parameters} from './parameters'
import {OutputVars} from './types'

export const getOutputVars = (
  createResp: {githubDeploymentJobID: string; projectId: string},
  params: Parameters
): OutputVars => {
  return {
    consoleURL: `https://cloud.hasura.io/project/${createResp.projectId}/console`,
    graphQLEndpoint: `https://${params.NAME}.${params.DOMAIN}/v1/graphql`,
    projectId: createResp.projectId,
    projectName: params.NAME
  }
}

export const waitFor = async (time: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
