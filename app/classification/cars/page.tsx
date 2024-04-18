'use client';

import CarsPredictionForm from '#/features/shared/components/cars-prediction-form';
import CarsPageTitle from '#/features/cars/components/title';
import CarsModels from '#/features/cars/components/cars-models';

export default function CarsModelsPage() {
  return (
    <div className="space-y-4">
      <CarsPageTitle />
      <CarsPredictionForm />
      <CarsModels />
    </div>
  );
}
