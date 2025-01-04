// src/api/update-user/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { authOptions } from '../auth/[...nextauth]/options';
import bcrypt from "bcryptjs"; // For password hashing

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { fullname, email, password, affilation, country, contactNumber } = body;

    try {
        const user = await UserModel.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update user fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            user.password = hashedPassword;
        }
        if (affilation) user.affilation = affilation;
        if (country) user.country = country;
        if (contactNumber) user.contactNumber = contactNumber;

        await user.save();

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating user data:", error);
        return NextResponse.json(
            { error: "Failed to update user data" },
            { status: 500 }
        );
    }
}