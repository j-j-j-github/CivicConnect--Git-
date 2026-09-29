import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS to allow requests from the Next.js frontend or any Netlify preview
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Serve static files (uploaded images)
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
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
