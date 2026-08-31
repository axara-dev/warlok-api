import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator
} from "@nestjs/terminus";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { sql } from "drizzle-orm";

import { db } from "../database/db";

@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Get()
  @AllowAnonymous()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => {
        try {
          await db.execute(sql`SELECT 1`);

          return {
            database: {
              status: "up"
            }
          };
        } catch {
          return {
            database: {
              status: "down"
            }
          };
        }
      },
      () => this.memory.checkHeap("memory_heap", 500 * 1024 * 1024)
    ]);
  }
}
