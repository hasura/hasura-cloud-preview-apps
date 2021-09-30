import {Context} from './context'
import {
  Project,
  RecreatePreviewAppResponse,
  CreatePreviewAppVariables,
  CreatePreviewAppResponse,
  GetTenantIdResponse,
  GetTenantIdVariables,
  DeleteTenantResponse,
  DeleteTenantVariables
} from './types'

export const doesProjectExist = async (context: Context): Promise<boolean> => {
  try {
    const resp = await context.client.query<
      {projects: Project[]},
      {name: string}
    >({
      query: `
				query getProjects ($name:String!) {
				  projects( where: {name: {_eq: $name}}) {
				    id
				  	name
				    endpoint
				  }
				}
			`,
      variables: {
        name: context.parameters.NAME
      }
    })
    if (resp.projects.length) {
      return true
    } else {
      return false
    }
  } catch (e) {
    if (e instanceof Error) {
      if (
        e.message &&
        e.message.includes('projects') &&
        e.message.includes('query_root')
      ) {
        throw new Error('invalid authorization to Hasura Cloud APIs')
      }
    }
    throw e
  }
}

export const createPreviewApp = async (
  context: Context
): Promise<{githubDeploymentJobID: string; projectId: string}> => {
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
            githubDeploymentJobID
            projectId
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

export const recreatePreviewApp = async (
  context: Context
): Promise<{githubDeploymentJobID: string; projectId: string}> => {
  try {
    const resp = await context.client.query<RecreatePreviewAppResponse, any>({
      query: `
        mutation recreatePreviewApp (
          $githubPAT: String!
          $appName: String!
          $region: String!
          $cloud: String!
          $plan: String!
          $env: [UpdateEnvsObject]
          $githubDir: String!
        ) {
          recreateGitHubPreviewApp (
            payload: {
              githubPersonalAccessToken: $githubPAT,
              projectOptions: {
                cloud: $cloud,
                region: $region,
                plan: $plan
                name: $appName
                envVars: $env 
              }
              githubRepoDetails: {
                directory: $githubDir
              }
            }
          ) {
            githubDeploymentJobID
            projectId
          }
        }
      `,
      variables: {
        githubPAT: context.parameters.GITHUB_TOKEN,
        appName: context.parameters.NAME,
        cloud: 'aws',
        region: context.parameters.REGION,
        plan: context.parameters.PLAN,
        env: context.parameters.HASURA_ENV_VARS,
        githubDir: context.parameters.HASURA_PROJECT_DIR
      }
    })
    return {
      ...resp.recreateGitHubPreviewApp
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
