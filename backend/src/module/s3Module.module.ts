import { Module } from '@nestjs/common'
import { S3Service } from 'src/service/S3Service.service'

@Module({
  imports: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
