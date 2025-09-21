/* eslint-disable prettier/prettier */
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, driverSchema } from 'src/schemas/Driver.schema';
import { DriverService } from './Driver.service';
import { DriverController } from './Driver.controller';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Driver.name,
        schema: driverSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [DriverService],
  controllers: [DriverController],
})
export class DriverModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        '/driverDetails',
        '/updateDriver',
        '/updateDriverPersonalInfo',
        '/driverList'
      ); // Protect userDetails route
  }
}
