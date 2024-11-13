import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config'
import { Logger } from '@nestjs/common'


async function bootstrap() {
  const serverConfig = config.get('server');
  const logger  = new Logger();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  })

  const port = serverConfig.port || 3000;
  logger.log(`Application succesfully deployed on the port: "${port}"`);
  await app.listen(3000);
}
bootstrap();
