import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with explicit configuration
  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Add WebSocket CORS configuration
  const server = app.getHttpServer();
  server.prependListener('upgrade', (req, socket, head) => {
    if (req.headers.origin === 'http://localhost:4000') {
      socket.write([
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        'Access-Control-Allow-Origin: http://localhost:4000',
        'Access-Control-Allow-Credentials: true'
      ].join('\r\n') + '\r\n\r\n');
      socket.pipe(socket);
    }
  });

  // Middleware for parsing cookies
  app.use(cookieParser());

  // Validation Pipes for DTO validation
  app.useGlobalPipes(new ValidationPipe());

  // Start listening
  await app.listen(3000);
}

bootstrap();
