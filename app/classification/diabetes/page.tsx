'use client';

import DiabetesPageTitle from '#/features/diabetes/title';
import DiabetesModels from '#/features/diabetes/diabetes-models';
import DiabetesPredictionForm from '#/features/shared/components/diabetes-prediction-form';

export default function DiabetesModelsPage() {
  return (
    <div className="space-y-4">
      <DiabetesPageTitle />
      <DiabetesPredictionForm />
      <DiabetesModels />
    </div>
  );
}
