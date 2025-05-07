'use client'

import { useStripe } from "@/app/hooks/use-stripe"

const buttonCn = 'border rounded-md px-1 cursor-pointer'

export default function Payments() {

  const { 
    instantiating, 
    createPaymentStripeCheckout, 
    createSubscriptionStripeCheckout, 
    createStripePortal
  } = useStripe()

  return (
    <main className='flex flex-col gap-8 items-center justify-center h-screen'>
      <h1 className='text-4xl font-semibold'>Payments</h1>

      {instantiating ? 'Loading...' : (
        <div className='flex flex-col gap-3'>
          <button 
            className={buttonCn} 
            name='payment' 
            value='payment-checkout' 
            onClick={() => createPaymentStripeCheckout({ testeId: 123 })}
          >
            Criar Pagamento Stripe
          </button>
          <button 
            className={buttonCn}
            onClick={() => createSubscriptionStripeCheckout({ testeId: 123 })}
          >
            Criar Assinatura Stripe
          </button>
          <button 
            className={buttonCn}
            onClick={() => createStripePortal()}
          >
            Criar Portal de Pagamentos
          </button>
        </div>
      )}
    </main>
  )
}
