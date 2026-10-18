import { NestFactory } from "@nestjs/core";
import { ValidationPipe, ConsoleLogger, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import {
  FastifyAdapter,
  NestFastifyApplication
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { auth } from "./auth";

const isProd = process.env.NODE_ENV === "production";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: isProd
        ? true
        : {
            transport: {
              target: "pino-pretty",
              options: { translateTime: "HH:MM:ss Z", ignore: "pid,hostname" }
            }
          }
    }),
    {
      bodyParser: false,
      logger: new ConsoleLogger({ json: isProd })
    }
  );

  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1"
  });

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

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 4000, "0.0.0.0");
}

bootstrap();
