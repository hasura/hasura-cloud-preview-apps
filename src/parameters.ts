import * as core from '@actions/core'
import {errors} from './errors'
import {Logger} from './logger'
import {
  createEphemeralDb,
  changeDbInPgString,
  dropEphemeralDb
} from './postgres'

const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || ''
const GITHUB_BRANCH_NAME = process.env.GITHUB_HEAD_REF || ''
const GITHUB_OWNER = GITHUB_REPOSITORY.split('/')[0]
const GITHUB_REPO_NAME = GITHUB_REPOSITORY.split('/')[1] || ''

export const getHasuraEnvVars = (rawEnvVars: string) => {
  return rawEnvVars
    .trim()
    .split('\n')
    .map(rawEnvVar => {
      const envMetadata = rawEnvVar.trim().split(';')
      if (envMetadata.length > 0) {
        const [key, value = ''] = envMetadata[0].trim().split('=')
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

const getBaseParameters = () => ({
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
})

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

const getPostgresServerMetadata = (rawMetadata: string) => {
  if (!rawMetadata.trim()) {
    return null
  }

  const metadataLines = rawMetadata.trim().split('\n')
  if (metadataLines.length < 2) {
    throw new Error('Invalid postgres server metadata.')
  }

  const [pgStringLabel, pgString] = metadataLines[0].trim().split('=')
  if (pgStringLabel !== 'POSTGRES_SERVER_CONNECTION_URI' || !pgString.trim()) {
    throw new Error(
      'Could not find PG_SERVER_CONNECTION_URI in the Postgres server metadata'
    )
  }

  const [
    envVarsForHasuraLabel,
    commaSeparatedEnvVars
  ] = metadataLines[1].trim().split(',')
  if (
    envVarsForHasuraLabel !== 'PG_ENV_VARS_FOR_HASURA' ||
    !commaSeparatedEnvVars.trim()
  ) {
    throw new Error(
      'Could not find valid PG_ENV_VARS_FOR_HASURA in Postgres server metadata'
    )
  }

  return {
    pgString: pgString.trim(),
    envVars: commaSeparatedEnvVars
      .trim()
      .split(',')
      .map(envVar => envVar.trim())
      .filter(envVar => !!envVar)
  }
}

export const getParameters = async (logger: Logger) => {
  const parameters = getBaseParameters()

  const postgresMetadata = getPostgresServerMetadata(
    core.getInput('ephemeralDBConfig')
  )
  if (postgresMetadata) {
    for (const env of postgresMetadata.envVars) {
      const dbName = env.toLowerCase()
      if (!parameters.SHOULD_DELETE) {
        try {
          await createEphemeralDb(postgresMetadata.pgString, dbName)
          parameters.HASURA_ENV_VARS = [
            ...parameters.HASURA_ENV_VARS,
            {
              key: env,
              value: changeDbInPgString(postgresMetadata.pgString, dbName)
            }
          ]
        } catch (e) {
          if (e instanceof Error) {
            throw new Error(
              `Could not create ephemeral database(s). ${e.message}`
            )
          }
          throw e
        }
      } else {
        try {
          await dropEphemeralDb(postgresMetadata.pgString, dbName)
        } catch (e) {
          if (e instanceof Error) {
            throw new Error(
              `Could not delete ephemeral database(s). ${e.message}`
            )
          }
          throw e
        }
      }
    }
  }

  try {
    validateParameters(parameters)
  } catch (e) {
    throw e
  }

  logger.debug(
    `Received parameters:\n${JSON.stringify(
      {
        ...parameters,
        HASURA_ENV_VARS: '***',
        HASURA_CLOUD_PAT: '***',
        GITHUB_TOKEN: '***'
      },
      null,
      4
    )}`
  )
  return parameters
}

export type Parameters = ReturnType<typeof getBaseParameters>
