import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";


export async function GET(request: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            {
                status: 401,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    const userEmail = session.user.email;

    try {
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0',
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                isReviewer: user.isReviewer,
            },
            {
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // Disable caching
                },
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
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