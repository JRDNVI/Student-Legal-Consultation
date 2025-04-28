import { appApi } from "../../api/api";

export async function uploadFileAndGetS3Key(table_name, file, role, user_id, item_id) {
    const presignedUrlResponse = await appApi.post("education/upload", {
        filename: file.name,
        role: role,
        id: user_id,
    });

    const { url, key } = presignedUrlResponse.data;

    const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
    });

    if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
    }

    const idFieldName = table_name === "student_documents" ? "assignment_id" : "task_id";

    if (table_name === "tasks_student") {
        await appApi.put("education/", {
            tableName: table_name,
            data: {
                filename: file.name,
                s3_key: key,
                uploaded_at: new Date().toISOString(),
            },
            where: {
                [idFieldName]: item_id,
            },
        });
    } else {
        await appApi.post("education/", {
            tableName: table_name,
            data: {
                [idFieldName]: item_id,
                filename: file.name,
                s3_key: key,
                uploaded_at: new Date().toISOString(),
            },
        });
    }

    return key;
}


export const fetchPresignedViewUrl = async (s3Key) => {
    const res = await fetch('https://204v2ssrj7.execute-api.eu-west-1.amazonaws.com/dev/education/view-file', {
        method: "POST",
        body: JSON.stringify({
            key: s3Key,
        }),
    });

    const { url } = await res.json();
    return url;
};
