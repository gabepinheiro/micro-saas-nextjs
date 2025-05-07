import { stripe } from "@/app/lib/stripe";
import { stripeCancelSubscription } from "@/app/server/stripe/cancel-subscription";
import { stripePaidSubscription } from "@/app/server/stripe/paid-subscription";
import { stripePayment } from "@/app/server/stripe/payment";
import { NextRequest, NextResponse } from "next/server";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'No signature or secret' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)

    switch (event.type) {
      case 'checkout.session.completed': // Pagamento realizado se status = paid - Pode ser tanto pagamento unico quanto assinatura
        const metadata = event.data.object.metadata

        if (metadata?.price === process.env.STRIPE_PRODUCT_ID) {
          await stripePayment(event)
        }

        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await stripePaidSubscription(event)
        }

        break;

      case 'checkout.session.expired': // Expirou o tempo de pagamento
        console.log('Enviar um para o usuário avisando que o pagamento expirou')
        break;

      case 'checkout.session.async_payment_succeeded': // Boleto pago
        console.log('Enviar um email para o usuário avisando que o pagamento foi realizado')
        break;

      case 'checkout.session.async_payment_failed': // Boleto não pago
        console.log('Enviar um email para o usuário avisando que o pagamento falhou')
        break;

      case 'customer.subscription.created': // 'Criou a assinatura'
        console.log('Mensagem de boas vindas porque acabou de assinar')
        break;

      case 'customer.subscription.updated': // Atualizou a assinatura
        console.log('Alguma coisa mudou na assinatura, dar uma olhada no que é enviar para o cliente')
        break;

      case 'customer.subscription.deleted': // Cancelou a assinatura
        await stripeCancelSubscription(event)
        break;

      default: 
        console.log('Unhandled event type ' + event.type)
    }

    return NextResponse.json({ message: 'Webhook received'}, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({error: 'Internal server error'}, { status: 500 })
  }
}
