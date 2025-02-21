import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //CORS configuration
  app.enableCors({
    origin : ['http://localhost:5173', 'https://d1w5k4nn5lbs5k.cloudfront.net'],
    methods : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders : ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials : true ,
    maxAge : 86400  //preflight results cache for 24 hours 
  });

  app.use(bodyParser.json({limit : '50mb'}));
  app.use(bodyParser.urlencoded({
    limit : '50mb',
    extended : true,
    parameterLimit : 50000
  }));

  //error handling
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000).then(()=>{
    console.log(process.env.PORT ?? 3000)
  });
}
bootstrap();
