import http from 'http';
import https from 'https';
import fs from 'fs';

export default async function download(
  url: string,
  path: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const adapter = new URL(url).protocol === 'https:' ? https : http;
    adapter
      .get(url, res => {
        const status = res.statusCode ?? 0;

        if (status >= 400) {
          reject(new Error(res.statusMessage));
          return;
        }

        if (status >= 300 && status < 400 && res.headers.location) {
          resolve(download(res.headers.location, path));
          return;
        }

        const file = fs.createWriteStream(path);
        res.pipe(file);
        file.on('finish', () => {
          file.close(error => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
}
