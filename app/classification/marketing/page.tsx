'use client';

import MarketingPageTitle from '#/features/marketing/title';
import MarketingPredictionForm from '#/features/shared/components/marketing-prediction-form';
import MarketingModels from '#/features/marketing/marketing-models';

export default function MachinesModelsPage() {
  return (
    <div className="space-y-4">
      <MarketingPageTitle />
      <MarketingPredictionForm />
      <MarketingModels />
    </div>
  );
}
