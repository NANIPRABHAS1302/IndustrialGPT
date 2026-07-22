import { z } from 'zod';

export const searchSchema = z.object({
  query: z.string().trim().min(1, 'Query is required')
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email')
});
