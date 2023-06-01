import { IsBoolean, IsOptional, IsString } from "class-validator";

export class VideoDto {
    @IsString()
    name: string

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean

    @IsString()
    videoPath: string

    @IsString()
    thumbnailPath: string

    // user?: { id: number }
}