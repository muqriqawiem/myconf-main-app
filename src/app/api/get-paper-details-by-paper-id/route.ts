import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import PaperModel from "@/model/PaperSchema";


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated",
            }),
            {
                status: 401,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            paperID: searchParams.get('paperID'),
        };

        const getPaperDetails = await PaperModel.findOne({
            paperID: queryParams.paperID,
        })
            .populate('paperAuthor')
            .populate('correspondingAuthor');

        if (!getPaperDetails) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Paper Details not found",
                    data: null,
                }),
                {
                    status: 404,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0',
                        'Content-Type': 'application/json',
                    },
                } // Use 404 for "not found" instead of 500
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Paper details for the conference",
                data: getPaperDetails,
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
                message: "Error occurred while fetching paper details",
                data: null,
            }),
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}