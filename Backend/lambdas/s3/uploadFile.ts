import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { corsHeaders } from "../utils";

const s3 = new S3Client({ region: process.env.REGION });

export const handler = async (event: any) => {
    const { filename, role, id } = JSON.parse(event.body);

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: `${role}/${id}/${filename}`,
        ContentType: "application/octet-stream",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return {
        statusCode: 200,
        body: JSON.stringify({ url, key: command.input.Key }),
        headers: corsHeaders
    };
};
