import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator
} from "@nestjs/terminus";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { getHeapStatistics } from "node:v8";

import {
  ERROR_SCHEMA_REQUIRED,
  ERROR_EXAMPLE,
  ERROR_DESCRIPTIONS
} from "../common/swagger/swagger.constants";

import { DrizzleHealthIndicator } from "./drizzle.health";

const MEMORY_HEAP_LIMIT = getHeapStatistics().heap_size_limit * 0.8;

@ApiTags("Health")
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
  @ApiOperation({
    summary: "Check application liveness",
    description:
      "Checks whether the application is running and able to respond to requests."
  })
  @ApiResponse({
    status: 200,
    description:
      "Success - The application is running and responding to requests.",
    schema: {
      type: "object",
      properties: {
        status: { type: "string" },
        info: {
          type: "object",
          nullable: true,
          additionalProperties: {
            type: "object",
            properties: {
              status: { type: "string" }
            },
            required: ["status"]
          }
        },
        error: {
          type: "object",
          nullable: true
        },
        details: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              status: { type: "string" }
            },
            required: ["status"]
          }
        }
      },
      required: ["status", "info", "error", "details"]
    },
    example: {
      status: "string",
      info: {},
      error: {},
      details: {}
    }
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiResponse({
    status: 503,
    description: "Service Unavailable. The application health check failed.",
    schema: {
      type: "object",
      properties: {
        status: { type: "string" },
        info: {
          type: "object",
          nullable: true
        },
        error: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              status: { type: "string" },
              message: { type: "string" }
            },
            required: ["status"]
          }
        },
        details: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              status: { type: "string" },
              message: { type: "string" }
            },
            required: ["status"]
          }
        }
      },
      required: ["status", "info", "error", "details"]
    },
    example: {
      status: "string",
      info: {},
      error: {
        database: {
          status: "string",
          message: "string"
        }
      },
      details: {
        database: {
          status: "string",
          message: "string"
        }
      }
    }
  })
  liveness() {
    return this.health.check([]);
  }

  @Get("readiness")
  @HealthCheck()
  @AllowAnonymous()
  @ApiOperation({
    summary: "Check application readiness",
    description:
      "Checks database connectivity and memory heap usage to determine whether the application is ready to handle requests."
  })
  @ApiResponse({
    status: 200,
    description: "Success - The application is ready to handle requests.",
    schema: {
      type: "object",
      properties: {
        status: { type: "string" },
        info: {
          type: "object",
          properties: {
            database: {
              type: "object",
              properties: {
                status: { type: "string" }
              },
              required: ["status"]
            },
            memory_heap: {
              type: "object",
              properties: {
                status: { type: "string" }
              },
              required: ["status"]
            }
          }
        },
        error: {
          type: "object",
          nullable: true
        },
        details: {
          type: "object",
          properties: {
            database: {
              type: "object",
              properties: {
                status: { type: "string" }
              },
              required: ["status"]
            },
            memory_heap: {
              type: "object",
              properties: {
                status: { type: "string" }
              },
              required: ["status"]
            }
          }
        }
      },
      required: ["status", "info", "error", "details"]
    },
    example: {
      status: "string",
      info: {
        database: {
          status: "string"
        },
        memory_heap: {
          status: "string"
        }
      },
      error: {},
      details: {
        database: {
          status: "string"
        },
        memory_heap: {
          status: "string"
        }
      }
    }
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiResponse({
    status: 503,
    description:
      "Service Unavailable. The application is not ready because a health indicator failed.",
    schema: {
      type: "object",
      properties: {
        status: { type: "string" },
        info: {
          type: "object"
        },
        error: {
          type: "object",
          additionalProperties: {
            type: "object",
            properties: {
              status: { type: "string" },
              message: { type: "string" }
            },
            required: ["status"]
          }
        },
        details: {
          type: "object",
          properties: {
            database: {
              type: "object",
              properties: {
                status: { type: "string" },
                message: { type: "string" }
              },
              required: ["status"]
            },
            memory_heap: {
              type: "object",
              properties: {
                status: { type: "string" }
              },
              required: ["status"]
            }
          }
        }
      },
      required: ["status", "info", "error", "details"]
    },
    example: {
      status: "string",
      info: {
        memory_heap: {
          status: "string"
        }
      },
      error: {
        database: {
          status: "string",
          message: "string"
        }
      },
      details: {
        database: {
          status: "string",
          message: "string"
        },
        memory_heap: {
          status: "string"
        }
      }
    }
  })
  readiness() {
    return this.health.check([
      () => this.db.isHealthy("database"),
      () => this.memory.checkHeap("memory_heap", MEMORY_HEAP_LIMIT)
    ]);
  }
}
