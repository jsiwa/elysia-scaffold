import { createClient } from '@libsql/client'
import { drizzle as bunDrizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { drizzle as libsqlDrizzle, LibSQLDatabase } from 'drizzle-orm/libsql'
import { t } from 'elysia'
import { Database } from 'bun:sqlite'
import Elysia from 'elysia'
import * as schema from './schemas/users'

const { TURSO_URL, TURSO_TOKEN  } = process.env

let db:BunSQLiteDatabase | LibSQLDatabase | undefined = undefined

if (TURSO_URL) {
  const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN,
  })
  db = libsqlDrizzle(client)
} else {
  const sqlite = new Database('sqlite.db')
  db = bunDrizzle(sqlite)
}

// Useful for validating request params
const idParamsSchema = t.Object({ id: t.Numeric() })

const dbPlugin = new Elysia({ prefix: '/api' })
  .decorate('db', db)

export {
  db,
  idParamsSchema,
  dbPlugin
}
