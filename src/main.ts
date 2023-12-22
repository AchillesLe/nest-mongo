import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpSuccessInterceptor } from '../vendor/interceptors/http-success.interceptor';
import { HttpExceptionFilter } from '../vendor/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpSuccessInterceptor());
  await app.listen(3000);
}
bootstrap();
