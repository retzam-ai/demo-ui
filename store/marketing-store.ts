import { DEFAULT_MODEL_QUERY_STATE } from '#/constants';
import { SupervisedLearningClassificationPredictionType } from '#/types';
import { create } from 'zustand';
import { produce } from 'immer';

type State = {
  predictions: SupervisedLearningClassificationPredictionType;
  setMarketingPredictions: (
    predictions: SupervisedLearningClassificationPredictionType,
  ) => void;
};

export const useMarketingStore = create<State>((set) => ({
  predictions: DEFAULT_MODEL_QUERY_STATE,
  setMarketingPredictions: (predictions) =>
    set((state) =>
      produce(state, (draftState: State) => {
        draftState.predictions = predictions;
      }),
    ),
}));
