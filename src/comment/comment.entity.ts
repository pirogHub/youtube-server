import { VideoEntity } from 'src/video/video.entity';
import { Entity,JoinColumn, Column,ManyToOne } from 'typeorm';
import { Base } from "utils/db/Base";
import { UserEntity } from 'src/user/entities/user.entity';

@Entity("Comment")
export class CommentEntity extends Base {

    @Column({ type: "text" })
    message: string


    @ManyToOne(() => UserEntity, user => user.comments)
    @JoinColumn({name: "user_id"})
    user: UserEntity

    @ManyToOne(() => VideoEntity, video => video.comments)
    @JoinColumn({name: "video_id"})
    video: VideoEntity
}