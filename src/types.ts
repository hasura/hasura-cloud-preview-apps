export type Plan = 'cloud_free' | 'cloud_payg'

export type Project = {
  name: string
  id: string
  endpoint: string
}

export type OutputVars = {
  graphQLEndpoint: string
  consoleURL: string
  jobId: string
}
