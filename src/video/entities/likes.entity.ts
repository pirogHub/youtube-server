import { UserEntity } from "src/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { VideoEntity } from "./video.entity";
import { Base } from "utils/db/Base";


@Entity("Likes")
export class LikesEntity extends Base {
    @ManyToOne(() => UserEntity, user => user.likes)
    @JoinColumn({ name: "from_user_id" })
    fromUser: UserEntity

    @ManyToOne(() => VideoEntity, video => video.likes)
    @JoinColumn({ name: "to_video_id" })
    toVideo: VideoEntity
}
