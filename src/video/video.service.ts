import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from './entities/video.entity';
import { VideoDto } from './video.dto';
import { LikesEntity } from './entities/likes.entity';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly videoRepository: Repository<VideoEntity>,
        @InjectRepository(LikesEntity)
        private readonly likesRepository: Repository<LikesEntity>,
    ) { }

    async byId(id: number, isPublic = false) {
        const video = await this.videoRepository.findOne({
            where: isPublic ? {
                id, isPublic: true
            } : {
                id
            },
            relations: {
                user: true,
                comments: {
                    user: true
                },
                likes: {
                    fromUser: true
                }
            },
            select: {
                user: {
                    id: true,
                    name: true,
                    avatarPath: true,
                    isVerified: true,
                    subscribersCount: true,
                    subscriptions: true
                },
                comments: {
                    message: true,
                    id: true,
                    user: {
                        id: true,
                        name: true,
                        avatarPath: true,
                        isVerified: true,
                        subscribersCount: true
                    }
                },
                likes: {
                    id: true,
                    fromUser: {
                        id: true,
                        avatarPath: true,
                    }
                }
            }
        })

        if (!video) throw new NotFoundException("video не найдено")
        return video
    }

    async update(editorId: number, videoId: number, dto: VideoDto) {
        const video = await this.byId(videoId)
        if (video.user.id !== editorId) {
            throw new ForbiddenException("Вы не можете редактировать чужое видео")
        }
        return this.videoRepository.save({ ...video, ...dto })
    }


    async getAll(searchTerm?: string) {
        let options: FindOptionsWhereProperty<VideoEntity> = {}

        if (searchTerm) {
            options = {
                name: ILike(`%${searchTerm}%`)
            }
        }

        return this.videoRepository.find({
            where: {
                ...options,
                isPublic: true
            },
            order: {
                createdAt: "DESC"
            },
            relations: {
                user: true,
                comments: {
                    user: true
                }
            },
            select: {
                user: {
                    id: true,
                    name: true,
                    avatarPath: true,
                    isVerified: true
                },
                likes: {
                    id: true,
                    fromUser: {
                        id: true
                    }
                }
            }
        })
    }

    async getMostPopularByViews() {
        return this.videoRepository.find({
            where: {
                views: MoreThan(0)
            },
            order: {
                views: -1
            }
        })
    }

    async create(userId: number) {
        const defaultValues = {
            name: '',
            user: { id: userId },
            videoPath: "",
            description: '',
            thumbnailPath: ""
        }

        const newVideo = await this.videoRepository.create(defaultValues)
        const video = await this.videoRepository.save(newVideo)
        return video.id
    }

    async delete(editorId: number, videoId: number) {
        const videoToDelete = await this.videoRepository.findOne({ where: { id: videoId, user: { id: editorId } } })
        if (!videoToDelete) {
            throw new ForbiddenException("Такого видео нет или Вы не можете редактировать чужое видео")
        }
        return this.videoRepository.remove(videoToDelete)
    }

    async updateCountViews(id: number) {
        const video = await this.byId(id)
        video.views++
        return this.videoRepository.save(video)
    }
    async updateLikes(videoId: number, userId: number) {
        const data = {
            toVideo: { id: videoId },
            fromUser: { id: userId }
        }
        const isLiked = await this.likesRepository.findOneBy(data)

        if (!isLiked) {
            const newLike = await this.likesRepository.create(data)
            await this.likesRepository.save(newLike)
            return true
        }
        await this.likesRepository.delete(data)
        return false
    }
}
