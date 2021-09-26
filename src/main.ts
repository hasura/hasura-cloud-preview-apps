import * as core from '@actions/core'
import {handler} from './handler'
import {Parameters} from './parameters'

async function run(): Promise<void> {
  try {
    //const parameters = getParameters();

    const params: Parameters = {
      PLAN: 'cloud_free',
      REGION: 'us-east-2',
      NAME: 'my-app',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
      HASURA_CLOUD_PAT:
        'XGytdW2Ew7vDhH6YzO6c1LUGpLTUziNR50c01sGnZCi7K3Vx31fpP61dAw4gbUNI',
      CLOUD_DATA_GRAPHQL: 'https://155c-106-51-72-39.ngrok.io/v1/graphql',
      GITHUB_REPO_NAME: 'hcgitest',
      GITHUB_OWNER: 'wawhal',
      GITHUB_BRANCH_NAME: 'main',
      HASURA_PROJECT_DIR: 'hasura'
    }
    const outputVars = await handler(params)
    const outputVarKeys = Object.keys(outputVars)
    for (let i = 0; i < outputVarKeys.length; i++) {
      core.setOutput(outputVarKeys[i], outputVars[outputVarKeys[i]])
    }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('unexpected error occured')
    }
  }
}

run()
