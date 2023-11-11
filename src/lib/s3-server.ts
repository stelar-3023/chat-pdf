import { S3 } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

export async function downloadFromS3(file_key: string) {
  try {
    const s3 = new S3({
      region: process.env.NEXT_PUBLIC_S3_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };
    const obj = await s3.getObject(params);
    // Ensure that the directory exists
    const directory = 'tmp/pdf'
    const file_name =
    path.join(directory, `${Date.now()}-${path.basename(file_key)}`);
    // `${file_key}`;
    // `/tmp/pdf/${Date.now()}.pdf`;

    if (obj.Body instanceof require('stream').Readable) {
      // AWS-SDK v3 has some issues with their typescript definitions, but this works
      // https://github.com/aws/aws-sdk-js-v3/issues/843
      //open the writable stream and write the file
      const file = fs.createWriteStream(file_name);
      return new Promise((resolve, reject) => {
        file.on('open', function (fd) {
          // @ts-ignore
          obj.Body?.pipe(file).on('finish', () => {
            resolve(file_name);
          });
        });
        file.on('error', (error) => {
          console.error(error);
          reject(error);
        });
      });
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
