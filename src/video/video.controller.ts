import { Post, Body, Put, Delete } from '@nestjs/common';
import { Controller, Query, Get, Param, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoDto } from './video.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/user/decorators/user.decorator';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @Get('get-private/:videoId')
  @Auth()
  async getVideoPrivate(@Param('videoId') id: string) {
    return this.videoService.byId(+id)
  }


  @Get('most-popular')
  async getMostPopularByViews() {
    return this.videoService.getMostPopularByViews()
  }

  @Get("by-id/:videoId")
  async getById(@Param("videoId") videoId: string) {
    console.log("by-id", videoId);

    return this.videoService.byId(+videoId)
  }

  @HttpCode(200)
  @Post()
  @Auth()
  async createVideo(@User("id") id: number) {
    return this.videoService.create(+id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(":videoId")
  @Auth()
  async updateVideo(@Param("videoId") videoId: string, @Body() dto: VideoDto, @User("id") editorId: number) {
    return this.videoService.update(+editorId, +videoId, dto)
  }

  @HttpCode(200)
  @Delete(":videoId")
  @Auth()
  async delete(@Param("videoId") videoId: string, @User("id") editorId: number) {
    return this.videoService.delete(+editorId, +videoId)
  }

  @HttpCode(200)
  @Put("update-views/:videoId")
  async updateViews(@Param("videoId") videoId: string) {
    return this.videoService.updateCountViews(+videoId)
  }

  @HttpCode(200)
  @Put("update-likes/:videoId")
  @Auth()
  async updateLikes(@Param("videoId") videoId: string, @User("id") likerId: number) {
    return this.videoService.updateLikes(+videoId, likerId)
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm: string) {
    return this.videoService.getAll(searchTerm)
  }




}
