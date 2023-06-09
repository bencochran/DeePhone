import logger from './logger';

// When testing, let the `undefined`s flow
const tests = process.env.NODE_ENV === 'test';

if (!tests && !process.env.AWS_REGION) {
  logger.error('Missing AWS_REGION');
  process.exit(1);
}
export const AWS_REGION = process.env.AWS_REGION!;

if (!tests && !process.env.S3_BUCKET_NAME) {
  logger.error('Missing S3_BUCKET_NAME');
  process.exit(1);
}
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

if (!tests && !process.env.S3_BUCKET_BASE_URL) {
  logger.error('Missing S3_BUCKET_BASE_URL');
  process.exit(1);
}
export const S3_BUCKET_BASE_URL = process.env.S3_BUCKET_BASE_URL!;

if (!tests && !process.env.AWS_ACCESS_KEY_ID) {
  logger.error('Missing AWS_ACCESS_KEY_ID');
  process.exit(1);
}
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID!;

if (!tests && !process.env.AWS_SECRET_ACCESS_KEY) {
  logger.error('Missing AWS_SECRET_ACCESS_KEY');
  process.exit(1);
}
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY!;

if (!tests && !process.env.TWILIO_AUTH_TOKEN) {
  logger.error('Missing TWILIO_AUTH_TOKEN');
  process.exit(1);
}
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
