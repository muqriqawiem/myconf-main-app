'use client';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

export default function AnalyticsPage() {
    const { data: session, status } = useSession();
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Log session data for debugging
    console.log("Session in AnalyticsPage:", session);

    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            fetchEmbedUrl(session.user.id);
        }
    }, [status, session]);

    const fetchEmbedUrl = async (userId: string) => {
        try {
            const response = await fetch(`/api/generate-signed-url?userId=${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch embed URL");
            }
            const data = await response.json();
            console.log("Fetched Embed URL:", data.embedUrl); // Log the URL
            setEmbedUrl(data.embedUrl);
        } catch (error) {
            console.error("Failed to fetch embed URL:", error);
            setError("Failed to load dashboard. Please try again later.");
        }
    };

    if (status === "loading") {
        return <Loader />;
    }

    if (status === "unauthenticated") {
        return <div className="container mx-auto p-4 text-red-500">Unauthorized. Please sign in to view this page.</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    }

    if (!embedUrl) {
        return <Loader />;
    }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <iframe
                src={embedUrl}
                style={{ border: "none", width: "100%", height: "100%" }}
                allowFullScreen
            />
        </div>
    );
}