import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { html } from '@elysiajs/html'
import { UserController } from './auth'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { dbPlugin } from '../db'

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
  .use(UserController)
  .state({
    title: packageJson.name as string,
    version: packageJson.version as string
  })
  .get('/', ({ Auth }) => {
    if (!Auth.user) return Bun.file('public/user.html')
    return Bun.file('public/home.html')
  })
  .listen(process.env.PORT ?? 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
