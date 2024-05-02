import { LucideIcon } from 'lucide-react';
import z from 'zod';

export const carsPredictionSchema = z.object({
  year: z.coerce.number().min(1970).max(2024),
  price: z.coerce.number().min(450).max(160000),
  transmission: z.string(),
  mileage: z.coerce.number().min(1).max(323000),
  fuelType: z.string(),
  tax: z.coerce.number().min(0).max(580),
  mpg: z.coerce.number().min(0.43).max(471),
  engineSize: z.coerce.number().min(0.6).max(6.6),
});

export const injuryPredictionSchema = z.object({
  age: z.coerce.number().min(1).max(100),
  weight: z.coerce.number().min(1).max(200),
  height: z.coerce.number().min(1).max(300),
  previousInjuries: z.coerce.number().min(0).max(1),
  trainingIntensity: z.coerce.number().min(0).max(1),
  recoveryTime: z.coerce.number().min(1).max(6),
});

export const machinesPredictionSchema = z.object({
  rotationSpeed: z.coerce.number().min(1168).max(2076),
  torque: z.coerce.number().min(16.7).max(68.9),
  toolWear: z.coerce.number().min(0).max(253),
  twf: z.coerce.number().min(0).max(1),
  hdf: z.coerce.number().min(0).max(1),
  pwf: z.coerce.number().min(0).max(1),
  osf: z.coerce.number().min(0).max(1),
});

export type SidebarLink = {
  title: string;
  label?: string;
  Icon: LucideIcon;
  route: string;
  routeRegex: RegExp;
  variant: 'default' | 'ghost';
};

export type SupervisedLearningClassificationPredictionType = {
  knn: string;
  naiveBayes: string;
  logisticRegression: string;
  isLoading: boolean;
  error: string;
  triggered: boolean;
};
