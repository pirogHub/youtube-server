import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Strategy, ExtractJwt } from "passport-jwt"

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get("JWT_SECRET")
        })
    }

    async validate({ id }: Pick<UserEntity, "id">) {
        return this.userRepository.findBy({ id })
    }
}
