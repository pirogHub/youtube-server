import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SubscriptionEntity } from './entities/subscription.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { hash, getSalt } from "bcryptjs"

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(SubscriptionEntity)
        private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    ) { }

    async byId(id: number) {
        console.log("user service byId", id);
        const user = await this.userRepository.findOne({
            where: {
                id
            },
            relations: {
                videos: {
                    user: true
                },
                subscriptions: {
                    toChannel: true
                }
            },
            select: {
                videos: true
            },
            order: {
                createdAt: "DESC"
            }
        })

        if (!user) throw new NotFoundException("User не найден")
        // console.log("user", user);

        return user
    }

    async updateProfile(id: number, dto: UserDto) {

        const isSameUser = await this.userRepository.findOneBy({ email: dto.email })
        if (isSameUser && id !== isSameUser.id) throw new BadRequestException("Email занят")

        const user = await this.byId(id)

        if (dto.password) {
            const salt = await getSalt(10)
            user.password = await hash(dto.password, salt)
        }

        user.email = dto.email ? dto.email : user.email
        user.name = dto.name ? dto.name : user.name
        user.description = dto.description ? dto.description : user.description
        user.avatarPath = dto.avatarPath ? dto.avatarPath : user.avatarPath

        return this.userRepository.save(user)
    }

    async subscribe(subscriberId: number, channelId: number) {
        const data = {
            toChannel: { id: channelId },
            fromUser: { id: subscriberId }
        }
        const isSubscribed = await this.subscriptionRepository.findOneBy(data)

        if (!isSubscribed) {
            const newSubscription = await this.subscriptionRepository.create(data)
            await this.subscriptionRepository.save(newSubscription)
            return true
        }

        await this.subscriptionRepository.delete(data)
        return false
    }

    async getAll() {
        return this.userRepository.find()
    }
}
