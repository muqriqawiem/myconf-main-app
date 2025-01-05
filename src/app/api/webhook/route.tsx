import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import ConferenceModel from '@/model/Conference';
import PaymentModel from '@/model/Payment';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: '2024-06-20', // Ensure you're using the latest API version
});

// Use the new Route Segment Config to disable body parsing
export const dynamic = 'force-dynamic'; // Ensure the route is dynamically rendered
export const fetchCache = 'force-no-store'; // Disable caching
export const runtime = 'nodejs'; // Ensure the route runs in the Node.js runtime

export async function POST(req: NextRequest) {
  await dbConnect();

  const sig = req.headers.get('stripe-signature');
  let event;

  try {
    // Read the raw body from the request
    const rawBody = await getRawBody(req);

    // Verify the event by constructing it using the raw body and Stripe's signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig || '',
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return NextResponse.json(
      { message: `Webhook Error: ${err.message}`, success: false },
      { status: 400 }
    );
  }

  console.log('Webhook received: ', event.type);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment received successfully. Session ID:', session.id);

      // Fulfillment logic goes here
      await fulfillOrder(session);
      break;

    case 'checkout.session.async_payment_failed':
      const failedSession = event.data.object as Stripe.Checkout.Session;
      console.log('Payment failed for session ID: ', failedSession.id);

      await PaymentModel.findOneAndUpdate(
        { stripePaymentId: failedSession.id },
        { status: 'failed' }
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}

// Fulfillment logic (e.g., update database, etc.)
async function fulfillOrder(session: Stripe.Checkout.Session) {
  console.log('Fulfilling order for session ID: ', session.id);

  // Get the selected conference ID from the custom fields
  const selectedConferenceId = session.custom_fields?.find(
    (field) => field.key === 'conferenceSelection'
  )?.dropdown?.value;

  console.log('Selected Conference ID: ', selectedConferenceId);

  if (!selectedConferenceId) {
    console.error('No conference ID found in the session custom fields.');
    return;
  }

  try {
    // Validate selectedConferenceId
    if (!mongoose.Types.ObjectId.isValid(selectedConferenceId)) {
      throw new Error('Invalid conference ID');
    }

    // Update conference collection to mark the security deposit as paid
    console.log('Updating Conference: ', selectedConferenceId);
    await ConferenceModel.updateOne(
      { _id: selectedConferenceId },
      { $set: { conferenceSecurityDeposit2000Paid: true } }
    );
    console.log('Conference updated successfully: ', selectedConferenceId);

    // Create a new payment document in the Payment collection
    console.log('Creating Payment: ', session.id);
    const payment = await PaymentModel.create({
      conferenceId: selectedConferenceId,
      userId: session.metadata?.userId || 'unknown',
      amount: session.amount_total ? session.amount_total / 100 : 0,
      paymentType: 'upfront',
      status: 'paid',
      stripePaymentId: session.id,
    });
    console.log('Payment created successfully: ', payment);
  } catch (err: any) {
    console.error('Error fulfilling order: ', err.message);
  }
}

// Helper function to read the raw body from the request
async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks);
}