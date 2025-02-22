
import {Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;
  private readonly logger = new Logger(S3Service.name);

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    this.logger.log(`Uploading image to s3: ${file}`);
    const uploadParams = {
      Bucket: this.bucketName,
      Key: `products/${uuid()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const { Location } = await this.s3.upload(uploadParams).promise();
      return Location;
    } catch (e) {
      this.logger.error(`Error uploading file to s3: ${e}`);
      throw new Error('Failed to upload file to S3');
    }
  }

  async deleteFile(Location: string){
    this.logger.log(`Deleting image from S3: ${Location}`);
    try {
      const params = {
        Bucket: this.bucketName,
        Key: Location.split("s3.amazonaws.com/").pop()
      };
      const data = await this.s3.deleteObject(params).promise();
      if(!data){
        this.logger.error(`Failed to delete file from S3: ${Location}`);
        return null;  
      }
      return data;
    } catch (error) {
      this.logger.error(`Error deleting file from s3: ${error}`);
      throw new Error('Failed to delete file from S3');
    }
  }
}
