import {validateParameters, Parameters} from '../src/parameters'
import {errors} from '../src/errors'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

const paramsBase: Parameters = {
  REGION: 'us-east-2',
  PLAN: 'cloud_free',
  GITHUB_TOKEN: 'test_token',
  CLOUD_DATA_GRAPHQL: 'https://data.pro.hasura.io/v1/graphql',
  NAME: 'sample-name',
  HASURA_CLOUD_PAT: 'test_pat'
}

test('parameters validation', () => {

  // throw error when github token is not provided
  let params = {
    ...paramsBase,
    GITHUB_TOKEN: ''
  }
  expect(() => {
    validateParameters(params)
  }).toThrow(errors.validation.githubToken)

  // throw error when name not provided
  params = {
    ...paramsBase,
    NAME: ''
  }
  expect(() => {
    validateParameters(params)
  }).toThrow(errors.validation.name)

  // throw errors when hasura cloud pat not provided
  params = {
    ...paramsBase,
    HASURA_CLOUD_PAT: ''
  }
  expect(() => {
    validateParameters(params)
  }).toThrow(errors.validation.hasuraCloudPAT)


})
