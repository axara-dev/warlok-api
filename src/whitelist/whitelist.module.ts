import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";

import { WhitelistController } from "./whitelist.controller";
import { WhitelistService } from "./whitelist.service";

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }])],
  controllers: [WhitelistController],
  providers: [WhitelistService]
})
export class WhitelistModule {}
