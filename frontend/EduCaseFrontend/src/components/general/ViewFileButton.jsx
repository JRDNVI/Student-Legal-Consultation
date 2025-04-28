import React, { useState } from "react";
import { fetchPresignedViewUrl } from "../../util/upload/uploadFiles";

const ViewFileButton = ({ s3Key, filename }) => {
    const [fileUrl, setFileUrl] = useState(null);

    const handleViewFile = async () => {
        try {
            const url = await fetchPresignedViewUrl(s3Key);
            setFileUrl(url);
            window.open(url, "_blank");
        } catch (error) {
            console.error("Error fetching file URL:", error);
        }
    };

    return (
        <div className="flex justify-end w-full">
            <button
                onClick={handleViewFile}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-lg transition"
            >
                View File: {filename}
            </button>
        </div>
    );
};

export default ViewFileButton;
