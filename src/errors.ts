export const errors = {
  validation: {
    name:
      'preview app name is mandatory; please provide it in the action inputs',
    hasuraCloudPAT:
      'hasura cloud personal access token is required for creating preview apps; please provide it in the action inputs',
    githubToken:
      'Github access token is required for Hasura Cloud to access metadata/migrations from your branch; please pass it in the GITHUB_TOKEN env var of the github action'
  }
}
