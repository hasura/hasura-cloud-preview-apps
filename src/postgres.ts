import {Client} from 'pg'
import {PGClient} from './types'

export const getPGVersion = async (pgClient: PGClient) => {
  try {
    pgClient.connect()
    // Sample output SELECT VERSION();:
    // PostgreSQL 14.3 (Ubuntu 14.3-1.pgdg22.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 11.2.0-19ubuntu1) 11.2.0, 64-bit
    // ^ We need 14.3 as the pg version string

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

export const disableNewConnections = async (
  dbName: string,
  pgClient: PGClient
) => {
  try {
    pgClient.connect()
    await pgClient.query(`
      UPDATE pg_database SET datallowconn = 'false' WHERE datname = "${dbName}";
		`)
  } catch (e) {
    throw e
  } finally {
    pgClient.end()
  }
}

export const revokeExistingConnections = async (
  dbName: string,
  pgClient: PGClient
) => {
  try {
    pgClient.connect()

    let pgStatActivityField = 'pid'

    const pgVersionString: string = await getPGVersion(pgClient)
    const versionSplit: string[] = pgVersionString.split('.')

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
    await disableNewConnections(dbName, pgClient)
    await revokeExistingConnections(dbName, pgClient)
    await pgClient.query(`
			DROP DATABASE IF EXISTS "${dbName}";
		`)
  } catch (e) {
    throw e
  } finally {
    pgClient.end()
  }
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
  const pgClient = new Client({
    connectionString
  })
  try {
    await dropAndCreateDb(dbName, pgClient)
  } catch (e) {
    throw e
  }
}

export const dropEphemeralDb = async (
  connectionString: string,
  dbName: string
) => {
  const pgClient = new Client({
    connectionString
  })
  try {
    await dropDB(dbName, pgClient)
  } catch (e) {
    throw e
  }
}
