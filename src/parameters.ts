import * as core from '@actions/core'
import {errors} from './errors'

const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || ''
const GITHUB_BRANCH_NAME = process.env.GITHUB_HEAD_REF || ''
const GITHUB_OWNER = GITHUB_REPOSITORY.split('/')[0]
const GITHUB_REPO_NAME = GITHUB_REPOSITORY.split('/')[1] || ''

export const parameters = {
  PLAN: core.getInput('plan'),
  REGION: core.getInput('region'),
  NAME: core.getInput('name') || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  HASURA_CLOUD_PAT: core.getInput('hasuraCloudAccessToken') || '',
  CLOUD_DATA_GRAPHQL: core.getInput('hasuraCloudGraphQLEndpoint'),
  HASURA_PROJECT_DIR: core.getInput('hasuraProjectDirectoryPath') || '',
  GITHUB_REPO_NAME,
  GITHUB_OWNER,
  GITHUB_BRANCH_NAME
}

export type Parameters = typeof parameters

export const validateParameters = (params: Parameters): void => {
  if (!params.NAME) {
    throw new Error(errors.validation.name)
  }
  if (!params.HASURA_CLOUD_PAT) {
    throw new Error(errors.validation.hasuraCloudPAT)
  }
  if (!params.GITHUB_TOKEN) {
    throw new Error(errors.validation.githubToken)
  }
}

export const getParameters = (): Parameters => {
  validateParameters(parameters)
  console.log(parameters)
  return parameters
}
