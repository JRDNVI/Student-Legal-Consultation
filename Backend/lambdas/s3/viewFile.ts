import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { corsHeaders } from "../utils";

const s3 = new S3Client({ region: process.env.REGION });

export const handler = async (event: any) => {
    const { key } = JSON.parse(event.body);

    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return {
        statusCode: 200,
        body: JSON.stringify({ url }),
        headers: corsHeaders,
    };
};
