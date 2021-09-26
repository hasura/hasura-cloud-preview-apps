import {handler} from '../src/handler'
import {Parameters} from '../src/parameters'
import {expect, test} from '@jest/globals'

const params: Parameters = {
  PLAN: 'cloud_free',
  REGION: 'us-east-2',
  NAME: 'mah-app',
  GITHUB_TOKEN: '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',
  HASURA_CLOUD_PAT:
    'XGytdW2Ew7vDhH6YzO6c1LUGpLTUziNR50c01sGnZCi7K3Vx31fpP61dAw4gbUNI',
  CLOUD_DATA_GRAPHQL: 'http://data.lux-dev.hasura.me/v1/graphql'
}

test('handler test', async () => {
  const x = await handler(params)
  console.log(x)
  expect(true).toBe(true)
})
