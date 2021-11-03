import {Context} from './context'
import {
  CreatePreviewAppVariables,
  CreatePreviewAppResponse,
  GetTenantIdResponse,
  GetTenantIdVariables,
  DeleteTenantResponse,
  DeleteTenantVariables,
  GetPreviewAppCreationJobResponse,
  GetPreviewAppCreationJobVariables
} from './types'
import {waitFor} from './utils'

export const createPreviewApp = async (
  context: Context
): Promise<CreatePreviewAppResponse['createGitHubPreviewApp']> => {
  try {
    const resp = await context.client.query<
      CreatePreviewAppResponse,
      CreatePreviewAppVariables
    >({
      query: `
        mutation createPreviewApp (
          $githubPAT: String!
          $appName: String!
          $githubRepoOwner: String!
          $githubRepo: String!
          $githubBranch: String!
          $githubDir: String!
          $region: String!
          $cloud: String!
          $plan: String!
          $env: [UpdateEnvsObject]
        ) {
          createGitHubPreviewApp (
            payload: {
              githubPersonalAccessToken: $githubPAT,
              githubRepoDetails: {
                  branch:$githubBranch
                  owner: $githubRepoOwner
                  repo: $githubRepo,
                  directory: $githubDir
              },
              projectOptions: {
                cloud: $cloud,
                region: $region,
                plan: $plan,
                name: $appName
                envVars: $env 
              }
            }
          ) {
            githubPreviewAppJobID
          }
        }
      `,
      variables: {
        githubDir: context.parameters.HASURA_PROJECT_DIR,
        githubPAT: context.parameters.GITHUB_TOKEN,
        githubRepoOwner: context.parameters.GITHUB_OWNER,
        githubRepo: context.parameters.GITHUB_REPO_NAME,
        githubBranch: context.parameters.GITHUB_BRANCH_NAME,
        appName: context.parameters.NAME,
        cloud: 'aws',
        region: context.parameters.REGION,
        plan: context.parameters.PLAN,
        env: context.parameters.HASURA_ENV_VARS
      }
    })
    return {
      ...resp.createGitHubPreviewApp
    }
  } catch (e) {
    throw e
  }
}

export const deletePreviewApp = async (context: Context) => {
  try {
    const getTenantIdResp = await context.client.query<
      GetTenantIdResponse,
      GetTenantIdVariables
    >({
      query: `
        query getTenantId ($projectName: String!) {
          projects (
            where: {
              name: {
                _eq: $projectName
              }
            }
          ) {
            id
            tenant {
              id
            }
          }
        }
      `,
      variables: {
        projectName: context.parameters.NAME
      }
    })
    if (getTenantIdResp.projects.length) {
      await context.client.query<DeleteTenantResponse, DeleteTenantVariables>({
        query: `
          mutation deleteTenant ($tenantId: uuid!) {
            deleteTenant(tenantId: $tenantId) {
              status
            }
          }
        `,
        variables: {
          tenantId: getTenantIdResp.projects[0].tenant.id
        }
      })
      return {}
    } else {
      throw new Error(
        'Could not delete the preview app because the given app does not exist.'
      )
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Could not delete the preview app. ${e.message}`)
    }
    throw e
  }
}

export const pollPreviewAppCreationJob = async (
  context: Context,
  jobId: string,
  timeLapse = 0
): Promise<{
  projectId: string
  githubDeploymentJobID: string
}> => {
  if (timeLapse > 120000) {
    throw new Error('preview app creation timed out')
  }
  try {
    const reqStartTime = new Date().getTime()
    const response = await context.client.query<
      GetPreviewAppCreationJobResponse,
      GetPreviewAppCreationJobVariables
    >({
      query: `
        query getPreviewAppCreationJob($jobId: uuid!="GF12zEeQai1skCuOoVU3wyyiqj30nEnzt2hpZ0LRe368UdwE5JC7nrT4AIr85rmu") {
          jobs_by_pk(id: $jobId) {
            id
            status
            tasks {
              id
              name
              task_events {
                id
                event_type
                public_event_data
                error
              }
            }
          }
        }

      `,
      variables: {
        jobId
      }
    })
    if (!response.jobs_by_pk) {
      throw new Error('No such preview app creation job exists')
    }

    if (response.jobs_by_pk.status === 'success') {
      const successEvent = response.jobs_by_pk.tasks[0].task_events.find(
        te => te.event_type === 'success'
      )
      if (!successEvent) {
        throw new Error('unexpected; no job success task event')
      }
      return {
        projectId: successEvent.public_event_data?.projectId || '',
        githubDeploymentJobID:
          successEvent.public_event_data?.githubDeploymentJobID || ''
      }
    }

    if (response.jobs_by_pk.status === 'skipped') {
      throw new Error(
        'This preview app creation was skipped due to another preview app creation being scheduled.'
      )
    }

    if (response.jobs_by_pk.status === 'failed') {
      const failedEvent = response.jobs_by_pk.tasks[0].task_events.find(
        te => te.event_type === 'failed'
      )
      console.log(failedEvent)
      if (!failedEvent) {
        throw new Error('unexpected; no job failure task event')
      }
      throw new Error(failedEvent.error)
    }

    await waitFor(2000)

    return pollPreviewAppCreationJob(
      context,
      jobId,
      timeLapse + new Date().getTime() - reqStartTime
    )
  } catch (e) {
    throw e
  }
}
