import * as core from '@actions/core'
import {errors} from './errors'

export const parameters = {
  PLAN: core.getInput('plan') || 'cloud_free',
  REGION: core.getInput('region') || 'us-east-2',
  NAME: core.getInput('name') || ''
}

type Parameters = typeof parameters

export const validateParameters = (params: Parameters): void => {
  if (!params.NAME) {
    throw new Error(errors.validation.name)
  }
}

export const getParameters = (): Parameters => {
  validateParameters(parameters)
  return parameters
}
