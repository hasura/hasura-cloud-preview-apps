import * as core from '@actions/core'
import {errors} from './errors'
import {Logger} from './logger'

const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || ''
const GITHUB_BRANCH_NAME = process.env.GITHUB_HEAD_REF || ''
const GITHUB_OWNER = GITHUB_REPOSITORY.split('/')[0]
const GITHUB_REPO_NAME = GITHUB_REPOSITORY.split('/')[1] || ''

export const getHasuraEnvVars = (rawEnvVars: string) => {
  return rawEnvVars
    .split('\n')
    .map(rawEnvVar => {
      const envMetadata = rawEnvVar.split(';')
      if (envMetadata.length > 0) {
        const [key, value = ''] = envMetadata[0].split('=')
        return {
          key,
          value
        }
      }
      return {
        key: '',
        value: ''
      }
    })
    .filter(env => !!env.key)
}

export const parameters = {
  PLAN: core.getInput('tier'),
  REGION: core.getInput('region'),
  NAME: core.getInput('name') || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  HASURA_CLOUD_PAT: process.env.HASURA_CLOUD_ACCESS_TOKEN || '',
  CLOUD_DATA_GRAPHQL: core.getInput('hasuraCloudGraphQLEndpoint'),
  HASURA_PROJECT_DIR: core.getInput('hasuraProjectDirectoryPath') || '',
  GITHUB_REPO_NAME,
  GITHUB_OWNER,
  GITHUB_BRANCH_NAME,
  HASURA_ENV_VARS: getHasuraEnvVars(core.getInput('hasuraEnv')),
  SHOULD_DELETE: [true, 'true'].includes(core.getInput('delete'))
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

export const getParameters = (logger: Logger): Parameters => {
  try {
    validateParameters(parameters)
  } catch (e) {
    throw e
  }
  logger.debug(`Received parameters:\n${JSON.stringify(parameters, null, 4)}`)
  return parameters
}
