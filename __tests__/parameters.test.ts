import {validateParameters} from '../src/parameters'
import {errors} from '../src/errors'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('parameters validation', () => {
  const params = {
    REGION: 'us-east-2',
    PLAN: 'cloud_free',
    NAME: ''
  }
  expect(() => {
    validateParameters(params)
  }).toThrow(errors.validation.name)
})
