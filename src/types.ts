export type Plan = 'cloud_free' | 'cloud_payg'

export type Project = {
  name: string
  id: string
  endpoint: string
}

export type Job = {
  id: string
  status: string
}

export type CreatePreviewAppResponse = {
  createGitHubPreviewApp: {
    project_id: string
    github_deployment_job_id: string
  }
}

export type CreatePreviewAppVariables = {
  githubPAT: string
  appName: string
  githubRepoOwner: string
  githubRepo: string
  githubBranch: string
  githubDir: string
  region: string
  cloud: string
  plan: string
}

export type RecreatePreviewAppResponse = {
  recreateGithubPreviewApp: CreatePreviewAppResponse['createGitHubPreviewApp']
}
export type RecreatePreviewAppVariables = CreatePreviewAppVariables

export type OutputVars = {
  graphQLEndpoint: string
  consoleURL: string
  jobId: string
}
