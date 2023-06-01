import { UserEntity } from "../entities/user.entity";
import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const User = createParamDecorator(
    (data: keyof UserEntity, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const user = request.user

        return data ? user[data] : user
    }
)