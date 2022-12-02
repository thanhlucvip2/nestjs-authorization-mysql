import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import '@nestjs/config';
async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule, { cors: false });

  await app.listen(port || 3000);
}
bootstrap();
