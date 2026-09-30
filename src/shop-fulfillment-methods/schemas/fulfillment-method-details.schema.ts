import { z } from "zod";

export const deliveryDetailsSchema = z.object({
  radius: z.number().int().positive(),

  minimumOrder: z.number().int().nonnegative().default(0),

  deliveryFee: z.number().int().nonnegative().default(0)
});

export const pickupDetailsSchema = z.null();
