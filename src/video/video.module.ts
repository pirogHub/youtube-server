import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoEntity } from './entities/video.entity';
import { LikesEntity } from './entities/likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, LikesEntity])],
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule { }
