// src/api/get-user/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const user = await UserModel.findOne({ email: session.user.email }).select(
            "-password -verifyCode -verifyCodeExpiry -forgotPasswordToken -forgotPasswordTokenExpiry"
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { error: "Failed to fetch user data" },
            { status: 500 }
        );
    }
}