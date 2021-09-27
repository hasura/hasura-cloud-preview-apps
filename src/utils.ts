import {Parameters} from './parameters'
import {OutputVars} from './types'

export const getOutputVars = (
  params: Parameters,
  createResp: {github_deployment_job_id: string; projectId: string}
): OutputVars => {
  return {
    consoleURL: `https://cloud.hasura.io/project/${createResp.projectId}/console`,
    graphQLEndpoint: `https://${params.NAME}.hasura.app/v1/graphql`,
    jobId: createResp.github_deployment_job_id
  }
}
