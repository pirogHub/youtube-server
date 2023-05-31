import { VideoEntity } from "src/video/video.entity"
import { Entity, OneToMany, Column } from "typeorm"
import { SubscriptionEntity } from "./subscription.entity"
import { Base } from "utils/db/Base"
import { CommentEntity } from "src/comment/comment.entity"


@Entity("User")
export class UserEntity extends Base {
    @Column({ unique: true })
    email: string

    @Column({ select: false })
    password: string

    @Column({ default: "" })
    name: string

    @Column({ default: false, name: "is_verified" })
    isVerified: string

    @Column({ default: 0, name: "subscribers_count" })
    subscribersCount?: number

    @Column({ default: "", type: "text" })
    description: string

    @Column({ default: "", name: "avatar_path" })
    avatarPath: string

    @OneToMany(() => VideoEntity, video => video.user)
    videos: VideoEntity[]

    @OneToMany(() => SubscriptionEntity, subscription => subscription.fromUser)
    subscriptions: SubscriptionEntity[]

    @OneToMany(() => SubscriptionEntity, subscription => subscription.toChannel)
    subscribers: SubscriptionEntity[]

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[]


}