import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schemas/*',
  out: './db/migrations',
  verbose: true,
  strict: true,
  driver: 'libsql',
  dbCredentials: {
    url: process.env.DRIZZLE_URL!
  },
})