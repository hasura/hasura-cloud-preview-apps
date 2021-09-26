import * as core from '@actions/core'
import {errors} from './errors'

export const parameters = {
  PLAN: core.getInput('plan') || 'cloud_free',
  REGION: core.getInput('region') || 'us-east-2',
  NAME: core.getInput('name') || '',
  GITHUB_TOKEN: core.getInput('githubToken'),
  HASURA_CLOUD_PAT: core.getInput('hasuraCloudAccessToken') || ''
}

export type Parameters = typeof parameters

export const validateParameters = (params: Parameters): void => {
  if (!params.NAME) {
    throw new Error(errors.validation.name)
  }
  if (!params.HASURA_CLOUD_PAT) {
    throw new Error(errors.validation.hasuraCloudPAT)
  }
}

export const getParameters = (): Parameters => {
  validateParameters(parameters)
  return parameters
}
