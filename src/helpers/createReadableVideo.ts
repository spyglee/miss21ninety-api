import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3({
  region: process.env.AWS_REGION,
});

export async function createReadableVideo(filename: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: filename,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1-hour access
  return url;
}