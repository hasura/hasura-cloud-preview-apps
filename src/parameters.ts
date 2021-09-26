import * as core from '@actions/core'
import {errors} from './errors'

export const parameters = {
  PLAN: core.getInput('plan'),
  REGION: core.getInput('region'),
  NAME: core.getInput('name') || '',
  GITHUB_TOKEN: core.getInput('githubToken'),
  HASURA_CLOUD_PAT: core.getInput('hasuraCloudAccessToken') || '',
  CLOUD_DATA_GRAPHQL: core.getInput('hasuraCloudGraphQLEndpoint')
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
  console.log(parameters)
  return parameters
}
