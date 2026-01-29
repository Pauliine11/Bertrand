import { z } from 'zod';

export const levelSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  order_index: z.number().int().min(1).default(1),
  content: z.any().describe("Level data/JSON").optional(),
  is_active: z.boolean().default(false),
});

export type LevelInput = z.infer<typeof levelSchema>;

