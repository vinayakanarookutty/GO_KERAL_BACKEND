/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //CORS configuration
const allowedOrigins = [
  'https://kerides.com',
  'https://www.kerides.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://dtc7ksfmzr3e8.cloudfront.net',
];

app.enableCors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'x-auth-token',
  ],
  credentials: true,
  maxAge: 86400,
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
    console.log(process.env.PORT ?? 3000)
  });
}
bootstrap();
