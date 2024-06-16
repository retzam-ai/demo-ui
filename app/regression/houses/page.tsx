'use client';

import CarsPredictionForm from '#/features/shared/components/cars-prediction-form';
import CarsPageTitle from '#/features/cars/components/title';
import CarsModels from '#/features/cars/components/cars-models';
import HousesPageTitle from '#/features/regression/components/houses-title';
import HousesModels from '#/features/regression/components/houses-models';
import HousesPredictionForm from '#/features/shared/components/regression/houses-prediction-form';

export default function HousesModelsPage() {
  return (
    <div className="space-y-4">
      <HousesPageTitle />
      <HousesPredictionForm />
      <HousesModels />
    </div>
  );
}
