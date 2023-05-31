import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { SubscriptionEntity } from './entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SubscriptionEntity])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
