import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin:"http://localhost:5173",
    credentials:true
  })
  const config = new DocumentBuilder ()
  .setTitle('Chat App API')
    .setDescription('API documentation for Chat Application')
    .setVersion('1.0')
     // ✅ THIS IS THE IMPORTANT PART
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // 👈 name of the security scheme
    )
    .build();
    const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
