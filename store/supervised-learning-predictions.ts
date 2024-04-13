import { DEFAULT_MODEL_QUERY_STATE } from '#/constants';
import { SupervisedLearningPredictionModelsType } from '#/types';
import { create } from 'zustand';

type State = {
  predictions: SupervisedLearningPredictionModelsType;
  setSupervisedLearningPredictions: (
    predictions: SupervisedLearningPredictionModelsType,
  ) => void;
};

export const useSupervisedLearningPredictionStore = create<State>((set) => ({
  predictions: DEFAULT_MODEL_QUERY_STATE,
  setSupervisedLearningPredictions: (predictions) => set({ predictions }),
}));
