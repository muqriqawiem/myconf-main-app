import { NextResponse } from 'next/server';
import ConferenceModel from '@/model/Conference';
import PaymentModel from '@/model/Payment';
import PaperModel from '@/model/PaperSchema'; // Import PaperModel
import { calculateTotalCost } from '@/lib/pricing';
import dbConnect from '@/lib/dbConnect';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20', // Ensure you're using the latest API version
});

export async function POST(request: Request) {
    try {
        // Connect to the database
        await dbConnect();

        // Parse the request body
        let conferenceId;
        try {
            const body = await request.json();
            conferenceId = body.conferenceId;
            console.log('Received conferenceId:', conferenceId);
        } catch (error) {
            console.error('Error parsing request body:', error);
            return NextResponse.json(
                { error: 'Invalid request body.' },
                {
                    status: 400,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0', // Disable caching
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        if (!conferenceId) {
            console.error('Conference ID is required.');
            return NextResponse.json(
                { error: 'Conference ID is required.' },
                {
                    status: 400,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0', // Disable caching
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Fetch the conference
        console.log('Fetching conference...');
        const conference = await ConferenceModel.findById(conferenceId);
        console.log('Conference:', conference);

        if (!conference) {
            console.error('Conference not found.');
            return NextResponse.json(
                { error: 'Conference not found.' },
                {
                    status: 404,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0', // Disable caching
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Ensure the conference has the `conferenceLifecycleStatus` field
        if (!conference.conferenceLifecycleStatus) {
            console.log('Setting default lifecycle status to "active"...');
            conference.conferenceLifecycleStatus = 'active';
        }

        // Check if the conference is already ended
        if (conference.conferenceLifecycleStatus === 'ended') {
            console.error('Conference is already ended.');
            return NextResponse.json(
                { error: 'Conference is already ended.' },
                {
                    status: 400,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0', // Disable caching
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        try {
            // Update the conference lifecycle status to "ended"
            console.log('Updating conference status to "ended"...');
            const updatedConference = await ConferenceModel.updateOne(
                { _id: conferenceId }, // Query to find the document
                { conferenceLifecycleStatus: 'ended' }, // Update to apply
                { new: true } // Return the updated document
            );

            if (!updatedConference) {
                console.error('Conference not found after update.');
                return NextResponse.json(
                    { error: 'Conference not found after update.' },
                    {
                        status: 404,
                        headers: {
                            'Cache-Control': 'no-store, max-age=0', // Disable caching
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            console.log('Conference status updated:', updatedConference);
        } catch (error) {
            console.error('Error updating conference status:', error);
            return NextResponse.json(
                { error: 'Failed to update conference status.' },
                {
                    status: 500,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0', // Disable caching
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Fetch all papers for the conference
        console.log('Fetching papers for the conference...');
        const papers = await PaperModel.find({ conference: conferenceId }); // Fetch papers for the conference
        console.log('Number of papers:', papers.length);

        // Calculate the total cost
        console.log('Calculating total cost...');
        const hasPaidSecurityDeposit = conference.conferenceSecurityDeposit2000Paid; // Assuming this field exists
        const totalCost = calculateTotalCost(papers.length, hasPaidSecurityDeposit);
        console.log('Total cost:', totalCost);

        // Save the invoice payment
        console.log('Saving invoice payment...');
        const invoicePayment = new PaymentModel({
            conferenceId,
            userId: conference.conferenceOrganizer,
            amount: totalCost,
            paymentType: 'invoice',
            status: totalCost === 0 ? 'paid' : 'pending', // Mark as paid if totalCost is 0
        });

        // Only create a Stripe payment intent if the total cost is greater than 0
        if (totalCost > 0) {
            console.log('Creating Stripe payment intent...');
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalCost * 100, // Convert to cents
                currency: 'usd',
                payment_method_types: ['card'],
            });

            // Update the invoice payment with the Stripe payment ID
            invoicePayment.stripePaymentId = paymentIntent.id;
        } else {
            console.log('No payment required. Using a placeholder value for stripePaymentId...');
            invoicePayment.stripePaymentId = "no-payment-required";
        }

        await invoicePayment.save();
        console.log('Invoice payment saved:', invoicePayment);

        return NextResponse.json(
            { success: true, conference, invoicePayment },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error ending conference:', error);
        return NextResponse.json(
            { error: 'Failed to end conference.' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // Disable caching
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}