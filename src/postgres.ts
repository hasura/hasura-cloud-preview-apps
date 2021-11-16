import {Client} from 'pg'
import {PGClient} from './types'

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

const createPgClient = (connectionString: string): PGClient => {
  const pgURL = new URL(connectionString)
  pgURL.searchParams.set('ssl', 'true')
  pgURL.searchParams.set('sslmode', 'prefer')
  return new Client({
    connectionString: pgURL.toString(),
    ssl: {
      rejectUnauthorised: true
    }
  })
}

export const createEphemeralDb = async (
  connectionString: string,
  dbName: string
) => {
  try {
    const pgClient = createPgClient(connectionString)
    await dropAndCreateDb(dbName, pgClient)
  } catch (e) {
    throw e
  }
}

export const dropEphemeralDb = async (
  connectionString: string,
  dbName: string
) => {
  try {
    const pgClient = createPgClient(connectionString)
    await dropDB(dbName, pgClient)
  } catch (e) {
    throw e
  }
}
