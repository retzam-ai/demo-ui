'use client';

import InjuryPredictionForm from '#/features/shared/components/injury-prediction-form';
import InjuryPageTitle from '#/features/injury/components/title';
import InjuryModels from '#/features/injury/components/injury-models';

export default function CarsModelsPage() {
  return (
    <div className="space-y-4">
      <InjuryPageTitle />
      <InjuryPredictionForm />
      <InjuryModels />
    </div>
  );
}
