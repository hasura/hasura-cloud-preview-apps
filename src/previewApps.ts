import {Client} from './client'
import {
  Project,
  RecreatePreviewAppResponse,
  RecreatePreviewAppVariables,
  CreatePreviewAppVariables,
  CreatePreviewAppResponse
} from './types'
import {Parameters} from './parameters'

export const doesProjectExist = async (
  appName: string,
  client: Client
): Promise<boolean> => {
  try {
    const resp = await client.query<{projects: Project[]}, {name: string}>({
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
        name: appName
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
  parameters: Parameters,
  client: Client
): Promise<{github_deployment_job_id: string; project_id: string}> => {
  try {
    const resp = await client.query<
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
              }
            }
          ) {
            github_deployment_job_id
            projectId
          }
        }
      `,
      variables: {
        githubDir: parameters.HASURA_PROJECT_DIR,
        githubPAT: parameters.GITHUB_TOKEN,
        githubRepoOwner: parameters.GITHUB_OWNER,
        githubRepo: parameters.GITHUB_REPO_NAME,
        githubBranch: parameters.GITHUB_BRANCH_NAME,
        appName: parameters.NAME,
        cloud: 'aws',
        region: parameters.REGION,
        plan: parameters.PLAN
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
  parameters: Parameters,
  client: Client
): Promise<{github_deployment_job_id: string; project_id: string}> => {
  try {
    const resp = await client.query<
      RecreatePreviewAppResponse,
      RecreatePreviewAppVariables
    >({
      query: `
        mutation recreatePreviewApp (
          $githubPAT: String!
          $appName: String!
          $githubRepoOwner: String!
          $githubRepo: String!
          $githubBranch: String!
          $githubDir: String!
          $region: String!
          $cloud: String!
          $plan: String!
        ) {
          recreateGithubPreviewApp (
            payload: {
              appName: $appName
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
                plan: $plan
              }
            }
          ) {
            github_deployment_job_id
            projectId
          }
        }
      `,
      variables: {
        githubDir: parameters.HASURA_PROJECT_DIR,
        githubPAT: parameters.GITHUB_TOKEN,
        githubRepoOwner: parameters.GITHUB_OWNER,
        githubRepo: parameters.GITHUB_REPO_NAME,
        githubBranch: parameters.GITHUB_BRANCH_NAME,
        appName: parameters.NAME,
        cloud: 'aws',
        region: parameters.REGION,
        plan: parameters.PLAN
      }
    })
    return {
      ...resp.recreateGithubPreviewApp
    }
  } catch (e) {
    throw e
  }
}
