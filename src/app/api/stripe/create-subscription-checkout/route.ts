import { auth } from "@/app/lib/auth";
import { stripe } from "@/app/lib/stripe";
import { getOrCreateStripeCustomer } from "@/app/server/stripe/get-customer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { testeId } = await request.json()

  const userSession = await auth()

  const userId = userSession?.user?.id
  const userEmail = userSession?.user?.email

  if (!userId || !userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID

  if (!price) return NextResponse.json({ error: 'Price not found' }, { status: 500 })

  // Precisamos criar um cliente NA STRIPE para ter referencia dele quando for criar o portal
  const customerId = await getOrCreateStripeCustomer(userId, userEmail)

  const metadata = {
    testeId,
    price,
    userId
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1 }],
      mode: 'subscription',
      payment_method_types: ['card'],
      success_url: `${request.headers.get('origin')}/success`,
      cancel_url: `${request.headers.get('origin')}/cancel`,
      metadata,
      customer: customerId
    })

    if (!session.url) return NextResponse.json({ error: 'Session URL not found' }, { status: 500 })

    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }

}
