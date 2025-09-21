import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/schemas/User.schema';
import { UserService } from './User.service';
import { UserController } from './User.controller';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    AuthModule,
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
