import { S3Client } from '@aws-sdk/client-s3';

import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  S3_BUCKET_BASE_URL
} from './env';

export const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
export const bucketName = S3_BUCKET_NAME;
export const bucketBaseURL = S3_BUCKET_BASE_URL;
