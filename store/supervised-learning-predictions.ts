import { DEFAULT_MODEL_QUERY_STATE } from '#/constants';
import { SupervisedLearningPredictionModelsType } from '#/types';
import { create } from 'zustand';
import { produce } from 'immer';

type State = {
  predictions: SupervisedLearningPredictionModelsType;
  setSupervisedLearningPredictions: (
    predictions: SupervisedLearningPredictionModelsType,
  ) => void;
};

export const useSupervisedLearningPredictionStore = create<State>((set) => ({
  predictions: DEFAULT_MODEL_QUERY_STATE,
  setSupervisedLearningPredictions: (predictions) =>
    set((state) =>
      produce(state, (draftState: State) => {
        draftState.predictions = predictions;
      }),
    ),
}));
