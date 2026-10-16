import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { DrizzleHealthIndicator } from "./drizzle.health";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    TerminusModule.forRoot({
      gracefulShutdownTimeoutMs: 12000
    })
  ],
  controllers: [HealthController],
  providers: [DrizzleHealthIndicator]
})
export class HealthModule {}
