import {Client} from 'pg'
import {PGClient} from './types'
import {parse as parsePGString} from 'pg-connection-string'

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
  const {user, password, host, port} = parsePGString(connectionString)
  const pgClient = new Client({
    user,
    password,
    host,
    port,
    ssl: {
      rejectUnauthorized: false
    }
  })
  return pgClient
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
