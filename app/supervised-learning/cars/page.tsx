'use client';

import KNNModel from '#/features/knn/components/knn-model';
import SupervisedLearningPageTitle from '#/features/knn/components/title';
import SupervisedPrediction from '#/features/shared/components/supervised-prediction';

export default function SupervisedLearningModelsPage() {
  return (
    <div className="space-y-4">
      <SupervisedLearningPageTitle />
      <SupervisedPrediction />
      <KNNModel />
    </div>
  );
}
