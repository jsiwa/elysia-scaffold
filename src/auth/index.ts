import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

interface UserPayloadSchema {
  userId: number;
  username: string;
  email: string;
}

const { JWT_SECRET } = process.env
if (!JWT_SECRET) throw new Error('Not found JWT_SECRET')

const authPlugin = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: '7d'
    })
  )
  .get('/sign/:name', async ({ jwt, cookie: { auth }, params }) => {
    auth.set({
      value: await jwt.sign(params),
      httpOnly: true,
      maxAge: 7 * 86400,
      path: '/profile',
    })

    return `Sign in as ${auth.value}`
  })
  .get('/profile', async ({ jwt, set, cookie: { auth } }) => {
    const profile = await jwt.verify(auth.value)

    if (!profile) {
      set.status = 401
      return 'Unauthorized'
    }

    return `Hello ${profile.name}`
  })

export {
  authPlugin
}