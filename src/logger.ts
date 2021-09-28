import * as core from '@actions/core'

export const createLogger = () => ({
  log: (log: string, linebreak=true) => {
    console.log(`${log}${linebreak ? '\n' : ''}`);
  },
  error: console.error,
  debug: core.debug,
  output: core.setOutput,
  terminate: core.setFailed
})

export type Logger = ReturnType<typeof createLogger>