import { authAction } from "@/app/actions/auth";
import Form from 'next/form'
import { ButtonFormStatus } from "@/app/components/button-form-status";

export default function LoginPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Form action={authAction}>
        <ButtonFormStatus title="Sign in with Google" />
      </Form>
    </div>
  )
}
