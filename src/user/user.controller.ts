import { Controller, Get, Param, HttpCode, ValidationPipe, UsePipes, Put, Body, ForbiddenException, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('profile')
  @Auth()
  async getProfile(@User('id') id: number) {
    return this.userService.byId(id)
  }

  @Get('by-id/:id')

  async getUser(@Param('id') id: string) {

    return this.userService.byId(+id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('/:id')
  async updateUser(@Param("id") id: string, @Body() dto: UserDto, @User("id") ownerId: number) {
    if (ownerId !== +id) {
      throw new ForbiddenException("Этот профиль не ваш")
    }
    return this.userService.updateProfile(+id, dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch('subscribe/:channelId')
  @Auth()
  async subscribeToChannel(@Param("channelId") channelId: string, @User("id") id: number) {
    return this.userService.subscribe(+id, +channelId)
  }

  @Get()
  async getUsers() {
    return this.userService.getAll()
  }
}
