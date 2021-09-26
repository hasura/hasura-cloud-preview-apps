import {createGqlClient} from './client'
import {parameters} from './parameters'
import {Project} from './types'

const gqlClient = createGqlClient(
  parameters.CLOUD_DATA_GRAPHQL,
  parameters.HASURA_CLOUD_PAT
)

export const doesProjectExist = async (
  appName: string,
  client = gqlClient
): Promise<boolean> => {
  try {
    const resp = await client.query<{projects: Project[]}, {name: string}>({
      query: `
				query getProjects ($name:String!) {
				  projects( where: {name: {_eq: $name}}) {
				    id
				  	name
				    endpoint
				  }
				}
			`,
      variables: {
        name: appName
      }
    })
    if (resp.projects.length) {
      return true
    } else {
      return false
    }
  } catch (e) {
    throw e
  }
}
