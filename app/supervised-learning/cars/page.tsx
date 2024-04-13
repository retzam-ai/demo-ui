'use client';

import React, { useState } from 'react';
import KNNModel from '#/features/knn/components/knn-model';
import SupervisedLearningPageTitle from '#/features/knn/components/title';
import { SupervisedLearningPredictionModelsSchema } from '#/types';
import SupervisedPrediction from '#/features/shared/components/supervised-prediction';
import { DEFAULT_MODEL_QUERY_STATE } from '#/constants';

export default function SupervisedLearningModelsPage() {
  const [predictions, setPredictions] =
    useState<SupervisedLearningPredictionModelsSchema>(
      DEFAULT_MODEL_QUERY_STATE,
    );

  const onPredictionTriggered = (
    predictionResult: SupervisedLearningPredictionModelsSchema,
  ) => {
    // setPredictions({ ...predictionResult });

    // console.log('control onPredictionTriggered', predictionResult);

    setPredictions((prevPredictions) => ({
      ...prevPredictions,
      triggered: predictionResult.triggered,
      knn: {
        ...prevPredictions.knn,
        isLoading: predictionResult.knn.isLoading,
        error: predictionResult.knn.error,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <SupervisedLearningPageTitle />
      <SupervisedPrediction
        predictions={predictions}
        onPredictionTriggered={onPredictionTriggered}
      />
      <KNNModel predictions={predictions} />
    </div>
  );
}
