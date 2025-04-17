'use server'

import { auth, signIn, signOut } from "../lib/auth"

export async function authAction () {
  const session  = await auth()

  if(session) return signOut({redirectTo: '/login'})

  return signIn('google', { redirectTo: '/dashboard' })
}
