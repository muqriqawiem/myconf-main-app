import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import PaymentModel from "@/model/Payment";
import ConferenceModel from "@/model/Conference";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated",
            }),
            { status: 401 }
        );
    }

    try {
        // Fetch payments for the logged-in user
        const payments = await PaymentModel.find({ userId: user._id })
            .populate({
                path: 'conferenceId',
                select: 'conferenceTitle', // Only select the conferenceTitle field
            });

        // Ensure conferenceId is populated
        const validPayments = payments.map((payment) => {
            if (!payment.conferenceId) {
                // If conferenceId is missing, throw an error or provide a default conference object
                throw new Error(`Payment (${payment._id}) is missing conferenceId`);
            }
            return payment;
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: validPayments.length > 0 ? "Payments found" : "No payments found",
                data: { payments: validPayments },
            }),
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                },
            }
        );
    } catch (error) {
        console.log("An unexpected error occurred: ", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error occurred while fetching payments",
            }),
            { status: 500 }
        );
    }
}