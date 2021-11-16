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
  if (!pgURL.searchParams.get('sslmode')) {
    pgURL.searchParams.set('sslmode', 'allow')
  }
  return new Client({
    connectionString: pgURL.toString()
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
