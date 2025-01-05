import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import { getServerSession, User } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { authOptions } from '../auth/[...nextauth]/options';
import ConferenceModel from '@/model/Conference';
import PaymentModel from '@/model/Payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Ensure you're using the latest API version
});

export async function POST(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log(user);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      { status: 401 }
    );
  }

  try {
    const { origin } = req.nextUrl; // Get the origin from the request
    const UserConferences = await ConferenceModel.find({
      conferenceOrganizer: user._id,
      conferenceSecurityDeposit2000Paid: false,
    });

    // Check if the user has any unpaid conferences
    if (UserConferences.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must create a conference before proceeding with the payment.',
        },
        { status: 400 }
      );
    }

    // Define the Stripe Checkout session parameters with proper types
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'], // Correct placement
      invoice_creation: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Paper Submission Security Deposit Fee',
              images: ['https://i.imgur.com/hXBvvxx.png'],
            },
            unit_amount: 5000, // Amount in cents
          },
          quantity: 1,
        },
      ],
      custom_fields: [
        {
          key: 'conferenceSelection',
          label: { type: 'custom', custom: 'Conference Name' },
          type: 'dropdown',
          dropdown: {
            options: UserConferences.map((conference) => ({
              label: `${conference.conferenceAcronym}`,
              value: `${conference._id}`,
            })),
          },
        },
      ],
      billing_address_collection: 'required',
      mode: 'payment',
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/cancel-payment`,
      metadata: {
        userId: user._id?.toString() || '', // Ensure userId is not undefined
      },
    };

    // Create the Stripe Checkout session
    const stripeSession = await stripe.checkout.sessions.create(sessionParams);

    //log the creation of the payment
    console.log('Creating payment for stripePaymentId: ', stripeSession.id);

    // Save payment details to the payment collection
    const selectedConferenceId = stripeSession.custom_fields?.find(
      (field) => field.key === 'conferenceSelection'
    )?.dropdown?.value;

    if (selectedConferenceId) {
      // Validate selectedConferenceId
      if (!mongoose.Types.ObjectId.isValid(selectedConferenceId)) {
        throw new Error('Invalid Conference ID');
      }

      //check if a payment with the same stripePaymentId already exists
      const existingPayment = await PaymentModel.findOne({
        stripePaymentId: stripeSession.id,
      });

      if (existingPayment) {
        console.log('Payment already exists: ', existingPayment);
        return NextResponse.json(
          {
            success: false,
            message: 'Payment already exists',
          },
          { status: 400 }
        );
      }

      //create a new payment
      const payment = await PaymentModel.create({
        conferenceId: selectedConferenceId,
        userId: user._id?.toString(),
        amount: 5000 / 100, // Convert cents to dollars
        paymentType: 'upfront',
        status: 'pending',
        stripePaymentId: stripeSession.id,
      });

      console.log('Payment saved successfully: ', payment);
    }

    return NextResponse.json({ id: stripeSession.id });
  } catch (err: any) {
    console.log('Stripe error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to create checkout session.',
      },
      { status: err.statusCode || 500 }
    );
  }
}