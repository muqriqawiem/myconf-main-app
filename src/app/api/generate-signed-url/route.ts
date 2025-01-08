import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

const METABASE_SITE_URL = process.env.METABASE_SITE_URL;
const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;

export async function GET(req: Request) {
    if (!METABASE_SITE_URL || !METABASE_SECRET_KEY) {
        return NextResponse.json(
            { error: "Metabase configuration is missing" },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // Disable caching
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    try {
        const payload = {
            resource: { dashboard: 10 }, // Replace with your dashboard ID
            params: {}, // Remove the user_id parameter
            exp: Math.round(Date.now() / 1000) + 24 * 60 * 60, // 10-minute expiration
        };

        const token = jwt.sign(payload, METABASE_SECRET_KEY);
        const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=false`;

        // Log the generated embed URL
        console.log("Generated Embed URL:", iframeUrl);

        return NextResponse.json({ embedUrl: iframeUrl });
    } catch (error) {
        console.error("Failed to generate signed URL:", error);
        return NextResponse.json(
            { error: "Failed to generate signed URL" },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // Disable caching
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}