import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',// check user controller for more details
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3002', // Allow requests from chat gateway
    credentials: true, // Allow cookies
  });
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests to backend
    credentials: true,
  });



  await app.listen(process.env.PORT);
}
bootstrap();
