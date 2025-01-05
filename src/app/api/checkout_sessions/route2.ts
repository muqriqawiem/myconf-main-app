//--------------------------------original code---------------------
// import mongoose from 'mongoose';
// import dbConnect from '@/lib/dbConnect';
// import { getServerSession, User } from 'next-auth';
// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { authOptions } from '../auth/[...nextauth]/options';
// import ConferenceModel from '@/model/Conference';
// import PaymentModel from '@/model/Payment';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


// export async function POST(req: NextRequest) {
//     await dbConnect();

//     const session = await getServerSession(authOptions);
//     const user: User = session?.user as User;
//     console.log(user)

//     if (!session || !session.user) {
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: 'Not Authenticated',
//             },
//             { status: 401 }
//         );
//     }

//     try {
//         const { origin } = req.nextUrl; // Get the origin from the request
//         const UserConferences = await ConferenceModel.find({
//             conferenceOrganizer: user._id, conferenceSecurityDeposit2000Paid: false
//         });

//         //check if the user has any unpaid conferences
//         if (UserConferences.length === 0) {
//             return NextResponse.json(
//                 {
//                     success: false,
//                     message: 'You must create a conference before proceeding with the payment.',
//                 },
//                 { status: 400 }
//             );
//         }

//         // const body = await req.json(); // Parse the JSON body

//         //     const customer=await stripe.customers.create({
//         //         name: body.customerName, // Pass the customer name
//         // })
//         // Creating the Stripe Checkout session with customer details
//         const stripeSession = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             invoice_creation: { enabled: true },
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: 'Paper Submission Security Deposit Fee',
//                             images: ['https://i.imgur.com/hXBvvxx.png'],
//                         },
//                         unit_amount: 5000,
//                     },
//                     quantity: 1,
//                 },
//             ],
//             custom_fields: [
//                 {
//                     key: 'conferenceSelection',
//                     label: { type: 'custom', custom: 'Conference Name' },
//                     type: 'dropdown',
//                     dropdown: {
//                         options: UserConferences.map((conference) => ({
//                             label: `${conference.conferenceAcronym}`,
//                             value: `${conference._id}`
//                         })),
//                     },
//                 },
//             ],
//             billing_address_collection: 'required',
//             //   phone_number_collection:true,
//             mode: 'payment',
//             // customer:customer.id,
//             success_url: `${origin}/payment-success`,
//             cancel_url: `${origin}/cancel-payment`,
//             metadata: {
//                 userId: user._id?.toString(),
//             },
//             // payment-cancel?canceled=true
//         });

//         //save payment details to the payment collection
//         const selectedConferenceId = stripeSession.custom_fields?.find(
//             (field) => field.key === 'conferenceSelection'
//         )?.dropdown?.value;

//         if (selectedConferenceId) {
//             //validate selectedConferenceId
//             if (!mongoose.Types.ObjectId.isValid(selectedConferenceId)) {
//                 throw new Error('Invalid Conference ID');
//             }

//             const payment = await PaymentModel.create({
//                 conferenceId: selectedConferenceId,
//                 userId: user._id?.toString(),
//                 amount: 5000 / 100,
//                 // currency: 'usd',
//                 paymentType: 'upfront',
//                 status: 'pending',
//                 stripePaymentId: stripeSession.id,
//             });

//             console.log('Payment saved successfully: ', payment);
//         }

//         return NextResponse.json({ id: stripeSession.id });
//     } catch (err: any) {
//         console.log('Stripe error:', err);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: err.message || 'Failed to create checkout session.',
//             },
//             { status: err.statusCode || 500 }
//         );
//     }
// }
