'use client';

import KNNModel from '#/features/knn/components/knn-model';
import SupervisedLearningPageTitle from '#/features/knn/components/title';
import SupervisedPrediction from '#/features/shared/components/supervised-prediction';
import { DEFAULT_MODEL_QUERY_STATE } from '#/constants';

export default function SupervisedLearningModelsPage() {
  return (
    <div className="space-y-4">
      <SupervisedLearningPageTitle />
      <SupervisedPrediction predictions={DEFAULT_MODEL_QUERY_STATE} />
      <KNNModel />
    </div>
  );
}
