import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import PaperModel from "@/model/PaperSchema";

// Explicitly opt out of static rendering
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
        const submittedPapers = await PaperModel.find({
            $or: [{ paperAuthor: user._id }, { correspondingAuthor: user._id }],
        })
            .populate("conference", "conferenceAcronym")
            .populate('paperAuthor')
            .populate('correspondingAuthor');

        return new Response(
            JSON.stringify({
                success: true,
                message: submittedPapers.length > 0 ? "Submitted papers found" : "No submitted papers found",
                data: { submittedPapers },
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
                message: "Error occurred while fetching submitted papers",
            }),
            { status: 500 }
        );
    }
}