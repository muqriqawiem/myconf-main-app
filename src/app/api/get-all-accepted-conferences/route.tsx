import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import ConferenceModel from "@/model/Conference";

export async function GET(request: Request) {
    await dbConnect();

    try {
        const getConferenceDetails = await ConferenceModel.find({
            conferenceStatus: "accepted",
        });

        if (!getConferenceDetails) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Conference details not found",
                }),
                {
                    status: 404,
                    headers: { 'Cache-Control': 'no-store, max-age=0' }, // Disable caching
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Conference details found",
                data: getConferenceDetails,
            }),
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // Disable caching
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error occurred while fetching conference details",
            }),
            {
                status: 500,
                headers: { 'Cache-Control': 'no-store, max-age=0' }, // Disable caching
            }
        );
    }
}