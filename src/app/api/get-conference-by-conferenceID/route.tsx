import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import ConferenceModel from "@/model/Conference";

export const dynamic = 'force-dynamic'; // disable static rendering

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

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
        const { searchParams } = new URL(request.url);
        const queryParams = {
            confName: searchParams.get('confName'),
        };

        const getConferenceDetails = await ConferenceModel.findOne({
            conferenceAcronym: queryParams.confName,
        }).limit(100);

        if (!getConferenceDetails) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Conference Details not found",
                }),
                { status: 404 } // Use 404 for "not found" instead of 500
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Conference Details Found by conference id",
                data: { getConferenceDetails },
            }),
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // Disable caching
                },
            }
        );
    } catch (error) {
        console.log("An unexpected error occurred: ", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error occurred while fetching conference details",
            }),
            { status: 500 }
        );
    }
}