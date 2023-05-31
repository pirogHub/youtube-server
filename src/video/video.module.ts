import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoEntity } from './video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity])],
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule { }
