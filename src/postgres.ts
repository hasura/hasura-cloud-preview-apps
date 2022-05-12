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

export const createEphemeralDb = async (
  connectionString: string,
  dbName: string
) => {
  const pgClient = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })
  try {
    await dropAndCreateDb(dbName, pgClient)
  } catch (e) {
    console.log('hit error with create db', e)
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
