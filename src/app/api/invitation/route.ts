import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import InvitationModel from "@/model/Invitation";
import { sendInvitationMail } from "@/helpers/sendInvitationMail";

export async function POST(request: Request) {
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

    const { conferenceId, recipientEmail, message } = await request.json();

    if (!conferenceId || !recipientEmail) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Missing required fields",
            }),
            {
                status: 400,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    try {
        // Save invitation in database
        const newInvitation = new InvitationModel({
            conferenceId,
            recipientEmail,
            senderId: user.id,
            message,
            status: "Sent",
        });

        await newInvitation.save();

        // Send invitation email
        const emailResponse = await sendInvitationMail(
            recipientEmail,
            user.name as string,
            message
        );

        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: emailResponse.message,
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

        return new Response(
            JSON.stringify({
                success: true,
                message: "Invitation sent successfully",
            }),
            {
                status: 201,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error("Error creating invitation:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error creating invitation",
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
