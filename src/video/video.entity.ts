import { CommentEntity } from "src/comment/comment.entity"
import { UserEntity } from "src/user/entities/user.entity"
import { Entity, OneToMany, Column, JoinColumn, ManyToOne } from "typeorm"
import { Base } from "utils/db/Base"

@Entity("Video")
export class VideoEntity extends Base {
    @ManyToOne(() => UserEntity, user => user.videos)
    @JoinColumn({ name: "user_id" })
    user: UserEntity

    @OneToMany(() => CommentEntity, comment => comment.video)
    comments: CommentEntity[]


    @Column()
    name: string

    @Column({ default: false, name: "is_public" })
    isPublic: string

    @Column({ default: 0 })
    views?: number

    @Column({ default: 0 })
    likes?: number

    @Column({ default: 0 })
    duration?: number

    @Column({ default: "", type: "text" })
    description: string

    @Column({ default: '', name: "video_path" })
    videoPath: string

    @Column({ default: '', name: "thumbnail_path" })
    thumbnailPath: string


}