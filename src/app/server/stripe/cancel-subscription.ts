import { db } from '@/app/lib/firebase';
import 'server-only'

import Stripe from "stripe";

export async function stripeCancelSubscription (event: Stripe.CustomerSubscriptionDeletedEvent) {
  if(event.data.object.status === 'canceled') {
    console.log('Cancelamento da assinatura realizado. Enviar email e bloquear acesso')

    const customerId = event.data.object.customer

    const userRef = await db.collection('users').where('stripeCustomerId', '==', customerId).get()

    if(userRef.empty){
      console.error('User not found')
    } 

    const userId = userRef.docs[0].id

    if(!userId) {
      console.error('User ID not found')
      return
    }

    await db.collection('users').doc(userId).update({
      subscriptionStatus: 'inactive'
    })
  }
}
