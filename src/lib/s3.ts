import * as AWS from 'aws-sdk';

export async function uploadToS3(file: File) {
  try {
    // AWS configuration
    AWS.config.update({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const s3 = new AWS.S3({
      region: 'us-east-1',
    });

    // File key (path within the S3 bucket)
    const file_key =
      'uploads/' + Date.now().toString() + file.name.replace(/\s+/g, '-');

    // Params for the upload
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    // Uploading the file to S3
    const upload = s3
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        console.log(
          'Uploading to S3...',
          parseInt(((evt.loaded * 100) / evt.total).toString()) + '%'
        );
      })
      .promise();

    await upload.then((data) => {
      console.log('Successfully uploaded to S3!', file_key);
    });

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return Promise.reject(error); // Ensures proper error propagation
  }
}

// Function to get the URL of the uploaded object
export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${file_key}`;
  return url;
}
