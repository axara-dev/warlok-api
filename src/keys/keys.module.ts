import { Module } from "@nestjs/common";
import { KeysService } from "./keys.service";
import { KeysController } from "./keys.controller";
import { CryptoService } from "./crypto.service";

@Module({
  controllers: [KeysController],
  providers: [KeysService, CryptoService]
})
export class KeysModule {}
