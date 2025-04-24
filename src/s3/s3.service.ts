/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucketName = "gokeralbucket";

  constructor() {
    this.s3 = new S3({
      region: "us-east-1",
      accessKeyId: "AKIA6GBMD42GKV7YOF4D",
      secretAccessKey: "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",
    });
  }

  async getPresignedUrl(fileName: string, fileType: string, folder: string) {
    const key = `${folder}/${uuidv4()}-${fileName}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60, // 1 minute
      ContentType: fileType,
      
    };

    const url = await this.s3.getSignedUrlPromise('putObject', params);

    return { url, key };
  }
}
