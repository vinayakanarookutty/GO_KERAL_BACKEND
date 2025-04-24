/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://d1w5k4nn5lbs5k.cloudfront.net',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'x-auth-token',
    ],
    credentials: true,
    maxAge: 86400, //preflight results cache for 24 hours
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // This prefix will be used in URLs
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );

  //error handling
  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000).then(() => {
    // console.log(process.env.PORT ?? 3000)
  });
}
bootstrap();
