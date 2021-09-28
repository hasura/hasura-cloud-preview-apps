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
    projectId: string
    githubDeploymentJobID: string
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
  recreateGitHubPreviewApp: CreatePreviewAppResponse['createGitHubPreviewApp']
}
export type RecreatePreviewAppVariables = CreatePreviewAppVariables

export type OutputVars = {
  graphQLEndpoint: string
  consoleURL: string
  jobId: string
}

export type JobDetails = {
  jobs_by_pk: {
    status: string
    tasks: {
      id: string
      name: string
      cloud: string
      region: string
      task_events: {
        event_type: string
        id: string
        error: string
        github_detail: string
      }[]
    }[]
  }
}
