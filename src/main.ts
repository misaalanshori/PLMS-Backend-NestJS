import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/response.interceptor';
import { HttpExceptionFilter } from './interceptor/http-exception.filter';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  app.enableCors({ origin: process.env.FRONTEND_BASE_URL });

  // 0. Exclude Extraneous Values
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  // 1. Global Interceptor (Formats Success)
  app.useGlobalInterceptors(new TransformInterceptor());

  // 2. Global Exception Filter (Formats Errors)
  app.useGlobalFilters(new HttpExceptionFilter());

  // 3. Global Validation Pipe (Formats Class-Validator errors)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        // Flatten errors for the Exception Filter to catch
        const formattedErrors = errors.reduce((acc, err) => {
          acc[err.property] = Object.values(err.constraints || {});
          return acc;
        }, {});

        // Throwing this passes it to the HttpExceptionFilter
        return new BadRequestException({
          message: 'Validation failed',
          error: 'Bad Request',
          errors: formattedErrors,
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
