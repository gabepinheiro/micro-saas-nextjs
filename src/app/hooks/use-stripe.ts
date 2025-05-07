import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useRef, useState } from "react";

export function useStripe() {
  const [instantiating, setInstantiating] = useState(true)

  const stripe = useRef<Stripe | null>(null)

  useEffect(() => {
    async function loadInstance() {
      try {
        const instance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!)
        stripe.current = instance

      } catch (error) {
        console.error(error)
      } finally {
        setInstantiating(false)
      }
    }

    loadInstance()
  }, [])



  const createPaymentStripeCheckout = useCallback(async (paymentData: any) => {
    if (!stripe.current) throw new Error('')

    try {
      const response = await fetch('/api/stripe/create-payment-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const data = await response.json()

      console.log(data)

      await stripe.current?.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      console.error(error)
    }
  }, [])


  const createSubscriptionStripeCheckout = useCallback(async (subscriptionData: any) => {
    if (!stripe.current) throw new Error('')

    try {
      const response = await fetch('api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionData)
      })

      const data = await response.json()


      await stripe.current.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      console.error(error)
    }
  }, [])

  const createStripePortal = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      const data = await response.json()

      window.location.href= data.url
    } catch (error) {
      console.error(error)
    }
  }, [])

  return {
    instantiating,
    stripe: stripe.current,
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    createStripePortal
  }
}
