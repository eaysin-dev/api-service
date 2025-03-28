import mongoose from 'mongoose';
import { z } from 'zod';

export const querySchema = z.object({
  sortBy: z.string().default('-createdAt'),
  projectBy: z.string().optional(),
  populate: z.string().optional(),
  limit: z.coerce
    .number() // Convert to number
    .min(1)
    .max(100)
    .default(10),
  page: z.coerce
    .number() // Convert to number
    .min(1)
    .default(1),
});

export const documentIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((value) => /[0-9]/.test(value), {
    message: 'Password must contain at least 1 number',
  })
  .refine((value) => /[a-zA-Z]/.test(value), {
    message: 'Password must contain at least 1 letter',
  });

// Type exports
export type TDocumentId = mongoose.Types.ObjectId | string;
export type TQuerySchema = z.infer<typeof querySchema>;
export type TPassword = z.infer<typeof passwordSchema>;
