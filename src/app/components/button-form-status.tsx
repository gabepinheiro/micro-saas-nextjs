'use client'

import { useFormStatus } from 'react-dom'

type AuthButtonProps = {
  title: string
}

export function ButtonFormStatus({ title }: AuthButtonProps) {
  const status = useFormStatus()

  return (
    <button type='submit' className='px-4 py-2 rounded-md border border-gray-700 cursor-pointer'>
      {status.pending ? 'Loading...' : title}
    </button>
  )
}
