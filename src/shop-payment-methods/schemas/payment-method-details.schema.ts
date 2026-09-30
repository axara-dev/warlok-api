import { z } from "zod";

export const cashDetailsSchema = z.null();

export const bankTransferDetailsSchema = z.object({
  bankName: z.string().min(2).max(100),
  accountName: z.string().min(2).max(150),
  accountNumber: z.string().min(4).max(50)
});

export const qrisDetailsSchema = z.object({
  qrisImage: z.string().url().max(2048)
});
