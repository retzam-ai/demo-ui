'use client';

import MachinesPageTitle from '#/features/machines/components/title';
import MachineModels from '#/features/machines/components/machines-models';
import MachinesPredictionForm from '#/features/shared/components/machines-prediction-form';

export default function MachinesModelsPage() {
  return (
    <div className="space-y-4">
      <MachinesPageTitle />
      <MachinesPredictionForm />
      <MachineModels />
    </div>
  );
}
