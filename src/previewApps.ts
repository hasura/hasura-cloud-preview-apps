import {Context} from './context'
import {
  Project,
  RecreatePreviewAppResponse,
  CreatePreviewAppVariables,
  CreatePreviewAppResponse
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
          $env: [UpdateEnvObject!]
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
          $env: [UpdateEnvObject!]
        ) {
          recreateGitHubPreviewApp (
            payload: {
              githubPersonalAccessToken: $githubPAT,
              projectOptions: {
                cloud: $cloud,
                region: $region,
                plan: $plan
                appName: $appName
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
        githubPAT: context.parameters.GITHUB_TOKEN,
        appName: context.parameters.NAME,
        cloud: 'aws',
        region: context.parameters.REGION,
        plan: context.parameters.PLAN,
        env: context.parameters.HASURA_ENV_VARS
      }
    })
    return {
      ...resp.recreateGitHubPreviewApp
    }
  } catch (e) {
    throw e
  }
}
