import { Post } from '@nestjs/common';
import { Controller, UsePipes, ValidationPipe, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CommentDto } from './dto/comment.dto';
import { User } from 'src/user/decorators/user.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async createComment(@User("id") userId: number, @Body() dto: CommentDto) {
    return this.commentService.create(userId, dto)
  }

  @HttpCode(200)
  @Delete("/:commentId")
  @Auth()
  async delete(@User("id") userId: number, @Param("commentId") commentId: string) {
    return this.commentService.delete(userId, +commentId)
  }


}
