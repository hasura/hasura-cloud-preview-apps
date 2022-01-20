export const errors = {
  validation: {
    name:
      'Preview app name is mandatory. Please provide it in the action input "name"',
    domain:
      'Preview app domain is mandatory. Please provide it in the action input "domain"',
    hasuraCloudPAT:
      'Hasura Cloud Personal access token is required for creating preview apps. Please pass it in the HASURA_CLOUD_ACCESS_TOKEN env var of the GitHub action.',
    githubToken:
      'GitHub access token is required for Hasura Cloud to access metadata/migrations from your branch. Please pass it in the GITHUB_TOKEN env var of the GitHub action.'
  },
  unexpected: 'Unexpected error occured.'
}
