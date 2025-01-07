import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

const ConferenceAnalyticsComponent = () => {
    const { data: session } = useSession();
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchEmbedUrl = async (userId: string) => {
        try {
            const response = await fetch(`/api/generate-signed-url?userId=${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch embed URL");
            }
            const data = await response.json();
            console.log("Fetched Embed URL:", data.embedUrl);
            setEmbedUrl(data.embedUrl);
        } catch (error) {
            console.error("Failed to fetch embed URL:", error);
            setError("Failed to load analytics. Please try again later.");
        }
    };

    useEffect(() => {
        if (session?.user?._id) {
            // Fetch the embed URL immediately
            fetchEmbedUrl(session.user._id);

            // Refresh the embed URL every 9 minutes (540,000 milliseconds)
            const interval = setInterval(() => {
                fetchEmbedUrl(session.user._id);
            }, 540000); // 9 minutes

            // Clean up the interval when the component unmounts
            return () => clearInterval(interval);
        }
    }, [session]);

    if (!session?.user?._id) {
        return <div>Please sign in to view your analytics.</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!embedUrl) {
        return <Loader />;
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">User Analytics</h2>
            <div style={{ width: "100%", height: "600px" }}>
                <iframe
                    src={embedUrl}
                    style={{ border: "none", width: "100%", height: "100%" }}
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default ConferenceAnalyticsComponent;