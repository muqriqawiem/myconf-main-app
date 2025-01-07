import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const ConferenceAnalyticsComponent = () => {
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEmbedUrl();
    }, []);

    const fetchEmbedUrl = async () => {
        try {
            const response = await fetch("/api/generate-signed-url");
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