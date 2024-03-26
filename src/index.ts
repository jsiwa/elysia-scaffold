import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { html } from '@elysiajs/html'
import { authPlugin } from './auth'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { dbPlugin } from '../db'
import { users } from '../db/schemas/users'

const isDev = process.env.NODE_ENV === 'development'

const packageJson = await Bun.file('package.json').json()

const app = new Elysia()
  .use(swagger())
  .use(cors({
    origin: isDev ? 'localhost' : /.*\.saltyaom\.com$/
  }))
  .use(staticPlugin({
    prefix: '/'
  }))
  .use(html())
  .use(dbPlugin)
  .use(authPlugin)
  .state({
    title: packageJson.name as string,
    version: packageJson.version as string
  })
  .get('/', ({ store: { title, version } }) => `Title: ${title}, Version: ${version}`)
  .get('/test', ( { db } ) => db.select().from(users).all())
  .listen(process.env.PORT ?? 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
