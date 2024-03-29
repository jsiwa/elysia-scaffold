import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { eq } from 'drizzle-orm'
import { dbPlugin } from '~dbIndex'
import { users, NewUser } from '~db/users'

const { JWT_SECRET } = process.env
if (!JWT_SECRET) throw new Error('Not found JWT_SECRET')

export const AuthService = new Elysia({ name: 'Service.Auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: '7d',
      path: '/'
    })
  )
  .derive({ as: 'global' }, async ({ jwt, cookie: { auth } }) => {
    const profile = await jwt.verify(auth.value)
    return {
      Auth: {
        user: profile
      }
    }
  })
  .macro(({ onBeforeHandle }) => ({
    isSignIn() {
      onBeforeHandle(({ Auth, error }) => {
        if (!Auth?.user || !Auth.user) return error(401)
      })
    }
  }))

export const SignService = new Elysia({ name: 'Service.Sign' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: '7d'
    })
  )
  .use(dbPlugin)
  .put('/register/:name', async ({ jwt, db, set, cookie: { auth }, params }) => {
    const result = await db.query.users.findFirst({
      where: eq(users.name, params.name)
    })

    if (result) {
      set.status = 401
      return {
        error: `This user name ${params.name} has already registered.`
      }
    }

    const user:NewUser = {
      name: params.name
    }

    const inserUserResult = await db.insert(users).values(user).returning()
    const o = inserUserResult[0]
    auth.set({
      value: await jwt.sign({
        name: o.name,
      }),
      httpOnly: true,
      maxAge: 7 * 86400,
      path: '/'
    })

    return {
      msg: `Sign in as ${inserUserResult}`
    }
  })
  .get('/login/:name', async ({ jwt, db, set, cookie: { auth }, params }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.name, params.name)
    })

    if (!user) {
      set.status = 401
      return {
        error: `This user name ${params.name} not registered.`
      }
    }

    auth.set({
      value: await jwt.sign({
        name: user.name,
      }),
      httpOnly: true,
      maxAge: 7 * 86400,
      path: '/'
    })

    return {
      msg: `Success logined. User name: ${user.name}`
    }
  })

export const UserController = new Elysia()
  .use(SignService)
  .use(AuthService)
  .guard({
    isSignIn: true
  })
  .get('/profile', ({ Auth: { user } }) => user)