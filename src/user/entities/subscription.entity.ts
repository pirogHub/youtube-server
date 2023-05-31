import { UserEntity } from "src/user/entities/user.entity"
import { VideoEntity } from "src/video/video.entity"
import { Entity, JoinColumn, ManyToOne } from "typeorm"

@Entity("Subscription")
export class SubscriptionEntity {
    @ManyToOne(() => UserEntity, user => user.subscriptions)
    @JoinColumn({ name: "from_user_id" })
    fromUser: UserEntity

    @ManyToOne(() => UserEntity, user => user.subscribers)
    @JoinColumn({ name: "to_channel_id" })
    toChannel: UserEntity
}