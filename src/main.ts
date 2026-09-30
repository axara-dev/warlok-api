import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { auth } from "./auth";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true
    }),
    {
      bodyParser: false
    }
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Warlok API")
    .setDescription("Warlok API Documentation")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const authDocument = await auth.api.generateOpenAPISchema();

  app.use(
    "/reference",
    apiReference({
      withFastify: true,
      sources: [
        {
          content: document,
          title: "API"
        },
        {
          content: authDocument,
          title: "Auth"
        }
      ]
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
