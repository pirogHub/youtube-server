import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

import { Post, Body, UsePipes, ValidationPipe, HttpCode } from "@nestjs/common"

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async login(@Body() dto: Omit<AuthDto, "name">) {
    return this.authService.login(dto)
  }

  @Post("register")
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto)
  }
}
