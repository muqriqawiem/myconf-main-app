import dbConnect from '@/lib/dbConnect';
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import SessionModel from '@/model/Session';


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
        const organizedSessions = await SessionModel.find({
            sessionOrganizer: user._id,
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: organizedSessions.length > 0 ? "Organized sessions found" : "No organized sessions found",
                data: { organizedSessions },
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
                message: "Error occurred while fetching organized sessions",
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