import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator
} from "@nestjs/terminus";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { getHeapStatistics } from "node:v8";
import { DrizzleHealthIndicator } from "./drizzle.health";

const MEMORY_HEAP_LIMIT = getHeapStatistics().heap_size_limit * 0.8;

@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DrizzleHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Get("liveness")
  @HealthCheck()
  @AllowAnonymous()
  liveness() {
    return this.health.check([]);
  }

  @Get("readiness")
  @HealthCheck()
  @AllowAnonymous()
  readiness() {
    return this.health.check([
      () => this.db.isHealthy("database"),
      () => this.memory.checkHeap("memory_heap", MEMORY_HEAP_LIMIT)
    ]);
  }
}
