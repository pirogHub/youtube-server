import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>
    ) { }

    async create(userId: number, dto: CommentDto) {
        const newComment = this.commentRepository.create({
            message: dto.message,
            video: { id: dto.videoId },
            user: { id: userId }
        })
        return this.commentRepository.save(newComment)
    }
    async delete(userId: number, commentId: number) {

        const commentToDelete = await this.commentRepository.findOne({ where: { id: commentId, user: { id: userId } } })

        if (!commentToDelete) {
            throw new ForbiddenException("Комментария нет или он не ваш")
        }

        return this.commentRepository.remove(commentToDelete)
    }

}
