import { S3Client } from '@aws-sdk/client-s3';

import logger from './logger.js'

if (!process.env.AWS_REGION) {
  logger.error('Missing AWS_REGION');
  process.exit(1);
}
if (!process.env.S3_BUCKET_NAME) {
  logger.error('Missing S3_BUCKET_NAME');
  process.exit(1);
}
if (!process.env.S3_BUCKET_BASE_URL) {
  logger.error('Missing S3_BUCKET_BASE_URL');
  process.exit(1);
}
if (!process.env.AWS_ACCESS_KEY_ID) {
  logger.error('Missing AWS_ACCESS_KEY_ID');
  process.exit(1);
}
if (!process.env.AWS_SECRET_ACCESS_KEY) {
  logger.error('Missing AWS_SECRET_ACCESS_KEY');
  process.exit(1);
}

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
export const bucketName = process.env.S3_BUCKET_NAME;
export const bucketBaseURL = process.env.S3_BUCKET_BASE_URL;
