/* eslint-disable prettier/prettier */
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, driverSchema } from 'src/schemas/Driver.schema';
import { DriverService } from './Driver.service';
import { DriverController } from './Driver.controller';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Driver.name,
        schema: driverSchema,
      },
    ]),
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
