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
    githubPreviewAppJobID: string
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
  env: {key: string; value: string}[]
}

export type RecreatePreviewAppResponse = {
  recreateGitHubPreviewApp: CreatePreviewAppResponse['createGitHubPreviewApp']
}
export type RecreatePreviewAppVariables = CreatePreviewAppVariables

export type OutputVars = {
  graphQLEndpoint: string
  consoleURL: string
  projectId: string
  projectName: string
}

export type DeleteOutputVars = {
  deletedProjectName: string
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

export type GetTenantIdResponse = {
  projects: {
    id: string
    tenant: {
      id: string
    }
  }[]
}

export type GetTenantIdVariables = {
  projectName: string
}

export type DeleteTenantResponse = {
  deleteTenant: {
    status: string
  }
}
export type DeleteTenantVariables = {
  tenantId: string
}

export type PGClient = any

export type GetPreviewAppCreationJobResponse = {
  jobs_by_pk?: {
    id: string
    status: string
    tasks: {
      id: string
      task_events: {
        id
        event_type
        public_event_data
        error
      }[]
    }[]
  } | null
}

export type GetPreviewAppCreationJobVariables = {
  jobId: string
}
