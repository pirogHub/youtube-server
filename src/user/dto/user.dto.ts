import { IsEmail, IsOptional, IsString, } from 'class-validator';
export class UserDto {
    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    password?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    avatarPath?: string
}