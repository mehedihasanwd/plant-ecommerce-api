import dotenvconfig from "../config/dotenvconfig";
import { AWSError, S3 } from "aws-sdk";
import { common_type } from "../types";
import { PromiseResult } from "aws-sdk/lib/request";

const s3: S3 = new S3({
  region: dotenvconfig.AMAZON_IAM_REGION,
  credentials: {
    accessKeyId: dotenvconfig.AWS_ACCESS_KEY,
    secretAccessKey: dotenvconfig.AWS_SECRET_ACCESS_KEY,
  },
});

interface IRemoveParams {
  Bucket: string;
  Key: string;
}

interface IUploadParams extends IRemoveParams {
  Body: Buffer;
  ContentType: string;
  MetaData: {
    "Content-Disposition": "inline";
  };
}

export type TS3ManagedUpload = S3.ManagedUpload.SendData;

export const uploadImageToS3 = async ({
  image,
}: {
  image: common_type.TUploadedFile;
}): Promise<TS3ManagedUpload | undefined> => {
  const params: IUploadParams = {
    Bucket: dotenvconfig.AMAZON_S3_BUCKET_NAME,
    Key: `${Date.now()}-${image.name.split(" ").join("-")}`,
    Body: image.data,
    ContentType: image.mimetype,
    MetaData: {
      "Content-Disposition": "inline",
    },
  };

  try {
    const uploaded_file: TS3ManagedUpload | undefined = await s3
      .upload(params)
      .promise();

    if (!uploaded_file) return undefined;

    return uploaded_file;
  } catch (e) {
    console.log(`S3 upload error (amazon_s3.ts): ${e}`);
  }
};

export const cloudfrontImageUrl = async ({
  cloud_image,
}: {
  cloud_image: TS3ManagedUpload;
}) => {
  const image_name = cloud_image.Location.split("/").at(-1);
  const url: string = `${dotenvconfig.AMAZON_S3_CLOUDFRONT_DOMAIN_NAME}/${image_name}`;

  return url;
};

export const removeImageFromS3 = async ({
  key,
}: {
  key: string;
}): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError> | undefined> => {
  const params: IRemoveParams = {
    Bucket: dotenvconfig.AMAZON_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    return await s3.deleteObject(params).promise();
  } catch (e) {
    console.log(`S3 remove error: ${e}`);
  }
};
