/* eslint-disable prettier/prettier */
// s3.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { S3Service } from './s3.service';


@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('presigned-url')
  async getPresignedUrl(
    @Body('fileName') fileName: string,
    @Body('fileType') fileType: string,
    @Body('folder') folder: string,
  ) {
    return this.s3Service.getPresignedUrl(fileName, fileType, folder);
  }
}
