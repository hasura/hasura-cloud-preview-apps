# Hasura Cloud Preview Apps

This action helps you manage Hasura Cloud preview apps on pull requests through the Hasura Cloud APIs. If you have a Hasura project with metadata and migrations in a Git repo, this enables you to get preview Hasura Cloud instances with the metadata and migrations automatically applied.

### Sample usage

#### Create preview apps on pull requests

You can use the following action to set up preview apps on your pull requests.

```yaml
name: 'hasura-cloud-preview'
on:
  pull_request:
    types: [open, reopen, synchronize]
    paths:
    	- hasura # path to the Hasura project directory in the repo
    branches:
      - main

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: hasura/hasura-cloud-preview-apps
        with:
          name: "project-name-pr-${{github.event.number}}" # name of the preview app to created
          hasuraProjectDirectoryPath: hasura # path to the Hasura project directory in the repo
          hasuraEnv: | # env vars exposed to the Hasura instance
           	HASURA_GRAPHQL_CORS_DOMAINS=http://my-site.com
           	PG_DATABASE_URL=${{secrets.PG_STRING}}
          postgresDBConfig: |
            POSTGRES_SERVER_CONNECTION_URI=${{secrets.PG_STRING}}
            PG_ENV_VARS_FOR_HASURA=PG_DB_URL_1,PG_DB_URL_2
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}} # ${{ secrets.GITHUB_TOKEN }} is provided by default by GitHub actions
          HASURA_CLOUD_ACCESS_TOKEN: ${{secrets.HASURA_CLOUD_ACCESS_TOKEN}} # Hasura Cloud access token to contact Hasura Cloud APIs

```

#### Deleting preview apps on pull request closure/merger

The following workflow can be used for deleting Hasura Cloud preview apps on closing/merging pull requests.

```yaml
name: 'delete-hasura-cloud-preview'
on:
  pull_request:
    types: [closed]

jobs:
  delete:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: hasura/hasura-cloud-preview-apps
        with:
          name: "project-name-pr-${{github.event.number}}" # name of the preview app to deleted
          delete: true
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}} # ${{ secrets.GITHUB_TOKEN }} is provided by default by GitHub actions
          HASURA_CLOUD_ACCESS_TOKEN: ${{secrets.HASURA_CLOUD_ACCESS_TOKEN}} # Hasura Cloud access token to contact Hasura Cloud APIs
```


## Input

- **name**: Name of the preview app to be created. This name must be unique for every pull request. You can construct it using the PR number that GitHub exposes `${{github.event.number}}` or use any unique parameter of the pull request.

- **hasuraCloudProjectDirPath**: (optional, default: "") Path to the Hasura project in the Git Repo.

- **region**: (optional, default: "us-east-2") AWS region to deploy the Hasura Cloud preview app on. You can check the supported regions in the new project form at https://cloud.hasura.io/projects.

- **tier**: (optional, default: "cloud_free") The tier of the the preview app. Use `cloud_free` for free tier and `cloud_payg` for Standard tier. A valid payment method is required at https://cloud.hasura.io/billing for creating Standard tier projects.

- **hasuraEnv**: (optional, default: "") The environment variables that you want to set for the Hasura Cloud preview app. These must be `KEY=value` pairs with each env var on a new line. For example:
	```yaml
	hasuraEnv: | # env vars exposed to the Hasura instance
  	 HASURA_GRAPHQL_CORS_DOMAINS=http://my-site.com
  	 ENV_VAR_1=value1
     ENV_VAR_2=value2
	```

- **delete**: (optional, default: false) This must only be used in jobs where you want to delete the preview apps with the name given in the `name` field. Refer to the above sample usage for deleting preview apps on preview app closure/merger.

- **postgresDBConfig**: This input accepts the connection URI of a postgres server and a comma-separated list of environment variables for the preview app that expect Postgres connection URIs. Given a Postgres server and a set of env vars, this action can create temporary databases in the postgres server and pass their connection strings to the given environment variables so that migrations can be applied on these freshly created databases. The format is as follows:
  ```yaml
  postgresDBConfig: | # postgres DB config for creating temporary databases
    POSTGRES_SERVER_CONNECTION_URI=${{secrets.PG_STRING}}
    PG_ENV_VARS_FOR_HASURA=PG_DB_URL_1,PG_DB_URL_2
  ```
  This action constructs the database name from the provided preview app, followed by making `DROP DATABASE IF EXISTS` and `CREATE DATABASE` queries with the given credentials in the POSTGRES_SERVER_CONNECTION_URI.

  Please make sure that this db config is also present in the deletion workflow so that this action also deletes the temporarily created databases when the PR is closed.


## Env Vars

- **GITHUB_TOKEN**: This env var is mandatory for Hasura Cloud to access the metadata and migrations from the branch of your Git repo. It is available in GitHub action by default in the `${{secrets.GITHUB_TOKEN}}` secret.
- **HASURA_CLOUD_ACCESS_TOKEN**: Hasura Cloud access token is mandatory for this GitHub action to contact the Hasura Cloud APIs.

## Output Variables

This action outputs the following output variables that you can use in the subsequent steps of your workflow or for commenting on the pull request:

- **graphQLEndpoint**: The GraphQL endpoint of the created Hasura preview app.
- **consoleURL**: The URL to the console UI of the created Hasura preview app.
- **projectName**: The name of the created Hasura preview app
- **projectId**: The hasura cloud project ID of the created Hasura preview app

You can access these output variables and use [this GitHub Action](https://github.com/hasura/comment-progress) for commenting on the pull requests.

## Reference:

Refer to [Hasura Cloud docs](https://hasura.io/docs/latest/graphql/cloud/preview-apps.html) to see how this works.
