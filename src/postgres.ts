import {Client} from 'pg'
import {PGClient} from './types'

export const getPGVersion = async (pgClient: PGClient) => {
  try {
    pgClient.connect()

    const result = await pgClient.query({
      rowMode: 'array',
      text: 'SELECT VERSION();'
    })

    const versionString: string = result.rows[0][0]

    const pgVersionString: string = versionString.split(' ')[1]

    return pgVersionString
  } catch (e) {
    throw e
  } finally {
    pgClient.end()
  }
}

export const revokeExistingConnections = async (
  dbName: string,
  pgClient: PGClient,
  pgVersionString: string
) => {
  try {
    const versionSplit: string[] = pgVersionString.split('.')

    let pgStatActivityField = 'pid'
    if (
      Number(versionSplit[0]) < 9 ||
      (Number(versionSplit[0]) === 9 && Number(versionSplit[1]) <= 1)
    ) {
      pgStatActivityField = 'procpid'
    }

    await pgClient.query(`
      SELECT pg_terminate_backend(pg_stat_activity.${pgStatActivityField})
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}'
        AND ${pgStatActivityField} <> pg_backend_pid();
		`)
  } catch (e) {
    throw e
  } finally {
    pgClient.end()
  }
}

export const dropAndCreateDb = async (dbName: string, pgClient: PGClient) => {
  try {
    pgClient.connect()

    await pgClient.query(`
			DROP DATABASE IF EXISTS "${dbName}";
		`)
    await pgClient.query(`
			CREATE DATABASE "${dbName}";
		`)
  } catch (e) {
    throw e
  } finally {
    pgClient.end()
  }
}

export const dropDB = async (dbName: string, pgClient: PGClient) => {
  try {
    pgClient.connect()

    // Disable new clients to connect to the database
    // This is clubbed with  dropDB function a new PG client cannot be created after the following query is executed
    await pgClient.query(`
      ALTER DATABASE ${dbName} CONNECTION LIMIT 0;
		`)

    await pgClient.query(`
			DROP DATABASE IF EXISTS "${dbName}";
		`)
  } catch (e) {
    throw e
  } finally {
    pgClient.end()
  }
}

export const stripSSLParameter = baseString => {
  const urlObj = new URL(baseString)
  urlObj.searchParams.delete('sslmode')
  return urlObj.toString()
}

export const changeDbInPgString = (baseString: string, dbName: string) => {
  const urlObj = new URL(baseString)
  urlObj.pathname = dbName
  return urlObj.toString()
}

export const createEphemeralDb = async (
  connectionString: string,
  dbName: string
) => {
  const connectionParams = connectionString.includes('sslmode=require')
    ? {
        connectionString: stripSSLParameter(connectionString),
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {connectionString}

  const pgVersionClient = new Client(connectionParams)

  const revokeExistingConnectionsPgClient = new Client(connectionParams)
  revokeExistingConnectionsPgClient.connect()

  const pgClient = new Client(connectionParams)

  try {
    const pgVersionString = await getPGVersion(pgVersionClient)

    await revokeExistingConnections(
      dbName,
      revokeExistingConnectionsPgClient,
      pgVersionString
    )

    await dropAndCreateDb(dbName, pgClient)
  } catch (e) {
    throw e
  }
}

export const dropEphemeralDb = async (
  connectionString: string,
  dbName: string
) => {
  const connectionParams = connectionString.includes('sslmode=require')
    ? {
        connectionString: stripSSLParameter(connectionString),
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {connectionString}
  const pgVersionClient = new Client(connectionParams)

  const revokeExistingConnectionsPgClient = new Client(connectionParams)
  revokeExistingConnectionsPgClient.connect()

  const dropDBPgClient = new Client(connectionParams)
  try {
    const pgVersionString = await getPGVersion(pgVersionClient)

    await revokeExistingConnections(
      dbName,
      revokeExistingConnectionsPgClient,
      pgVersionString
    )

    await dropDB(dbName, dropDBPgClient)
  } catch (e) {
    throw e
  }
}
