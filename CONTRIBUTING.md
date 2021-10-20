# To the contributors

*This doc is a WIP*

The configuration for this GitHub action lives in `action.yml`. This action gets its inputs and env vars and passes it to the script whose path starts in `src/main.ts`.

## Localdev

You can run the script in `src/main.ts` by running `npm run main` in the root directory.

This script might fail due to some parameters being absent. You might have to hardcode some parameters for testing. A better localdev setup is a WIP.


## CI

You can open a PR in this repo by modifying the `hasuraCloudGraphQLEndpoint` input in `.github/workflows/test.yml` with the URL of the cloud data service. This will run this github action in the CI.
