import { authAction } from "@/app/actions/auth"
import { ButtonFormStatus } from "@/app/components/button-form-status"
import { auth } from "@/app/lib/auth"
import Form from "next/form"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Dashboard () {
  const session = await auth()

  if(!session) return redirect('/login')
  
  return (
    <div className='flex flex-col gap-8 items-center justify-center h-screen'>
      <h1 className='text-4xl font-semibold'>Protected Dashboard</h1>
      {session && (
        <>
          {session.user?.email && <p>{session.user.email}</p>}
          <Form action={authAction}>
            <ButtonFormStatus title='Logout' />
          </Form> 
          <Link href='/payments'>Payments</Link>
        </>
      )}
    </div>
  )
}
