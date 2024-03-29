import { sql } from "drizzle-orm"
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core"

export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  email: text('email').notNull().default(''),
  lastip: integer('lastip').notNull().default(0),
  type: integer('type').notNull().default(0),
  status: integer('status').notNull().default(0),
  created: integer('created').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated: integer('updated').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type NewUser = typeof users.$inferInsert