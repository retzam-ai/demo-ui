import { z } from 'zod';

export const housePredictionSchema = z.object({
  squareFeet: z.coerce.number().min(100),
  bedrooms: z.coerce.number(),
  bathrooms: z.coerce.number(),
  neigborhood: z.coerce.string(),
  yearBuilt: z.coerce.number().min(1950),
});
