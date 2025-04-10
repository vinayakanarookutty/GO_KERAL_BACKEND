import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/schemas/User.schema';
import { UserService } from './User.service';
import { UserController } from './User.controller';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('/userDetails', '/userProfile', '/updateDriverPersonalInfo'); // Protect userDetails route
  }
}
