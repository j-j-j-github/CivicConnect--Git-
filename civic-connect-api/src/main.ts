import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS to allow requests from the Next.js frontend
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe for validating incoming DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`CivicConnect API is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
