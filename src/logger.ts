import * as core from '@actions/core'

export const createLogger = () => ({
  log: console.log,
  error: console.error,
  debug: core.debug,
  output: core.setOutput,
  terminate: core.setFailed
})
