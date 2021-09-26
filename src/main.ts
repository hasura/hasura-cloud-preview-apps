import * as core from '@actions/core'
import {getParameters} from './parameters'
import {doesProjectExist} from './previewApps'

async function run(): Promise<void> {
  try {
    const parameters = getParameters()
    const exists = await doesProjectExist(parameters.NAME)
    core.setOutput('exists', exists)
    core.setOutput('graphqlEndpoint', 'https://something')
    core.setOutput('name', parameters.NAME)
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('unexpected error occured')
    }
  }
}

run()
