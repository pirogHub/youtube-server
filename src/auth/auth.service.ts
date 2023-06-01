import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt"
import { AuthDto } from './dto/auth.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common"

import { compare, genSalt, hash } from "bcryptjs"

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }

    async login(dto: Omit<AuthDto, "name">) {


        const existedUser = await this.validateUser(dto)

        const accessToken = await this.issueAccessToken(existedUser.id)
        return {
            user: this.returnUserFields(existedUser),
            accessToken
        }


    }



    async register(dto: AuthDto) {

        const existedUser = await this.userRepository.findOneBy({ email: dto.email })
        if (existedUser) throw new BadRequestException("Email занят")

        const salt = await genSalt(10)
        console.log("dto", dto);

        const newUser = await this.userRepository.create({
            name: dto.name,
            email: dto.email,
            password: await hash(dto.password, salt)
        })
        const user = await this.userRepository.save(newUser)
        const accessToken = await this.issueAccessToken(user.id)
        return {
            user: this.returnUserFields(user),
            accessToken

        }


    }

    async validateUser(dto: Omit<AuthDto, "name">) {
        const user = await this.userRepository.findOne({
            where: {
                email: dto.email
            },
            select: ['id', 'email', 'password']
        })

        if (!user) throw new NotFoundException("Пользователь не найден")

        const isValidPassword = await compare(dto.password, user.password)
        if (!isValidPassword) throw new UnauthorizedException("Неправильный email или пароль")

        return user

    }

    async issueAccessToken(userId: number) {
        const data = { id: userId }
        return await this.jwtService.signAsync(data, { expiresIn: "31d" })
    }

    returnUserFields(user: UserEntity) {
        return {
            id: user.id,
            email: user.email,
            name: user.name
        }
    }



}
