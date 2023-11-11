import { PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Progress } from '@aws-sdk/lib-storage';

export async function uploadToS3(file: File) {
  try {
    const s3 = new S3({
      region: process.env.NEXT_PUBLIC_S3_REGION!,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const file_key = 
    `${file.name}`;
    // 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file.name,
      Body: file,
    };

    const upload = new Upload({
      client: s3,
      params: params,
    });

    upload.on('httpUploadProgress', (progress: Progress) => {
      if (progress.loaded !== undefined && progress.total !== undefined) {
        console.log(
          'uploading to s3...',
          Math.round((progress.loaded / progress.total) * 100) + '%'
        );
      }
    });

    await upload.done().then((data) => {
      console.log('upload success', file_key);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {}
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;
  return url;
}
