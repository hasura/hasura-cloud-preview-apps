import {Client} from './client'
import {Project} from './types'

export const doesProjectExist = async (
  appName: string,
  client: Client
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
    console.log(resp)
    if (resp.projects.length) {
      return true
    } else {
      return false
    }
  } catch (e) {
    throw e
  }
}
