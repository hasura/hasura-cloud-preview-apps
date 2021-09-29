import {Parameters} from './parameters'
import {OutputVars} from './types'

export const getOutputVars = (
  createResp: {githubDeploymentJobID: string; projectId: string},
  params: Parameters
): OutputVars => {
  return {
    consoleURL: `https://cloud.hasura.io/project/${createResp.projectId}/console`,
    graphQLEndpoint: `https://${params.NAME}.hasura.app/v1/graphql`,
    jobId: createResp.githubDeploymentJobID
  }
}

export const waitFor = async (time: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
