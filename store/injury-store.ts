import { DEFAULT_MODEL_QUERY_STATE } from '#/constants';
import { SupervisedLearningClassificationPredictionType } from '#/types';
import { create } from 'zustand';
import { produce } from 'immer';

type State = {
  predictions: SupervisedLearningClassificationPredictionType;
  setInjuryPredictions: (
    predictions: SupervisedLearningClassificationPredictionType,
  ) => void;
};

export const useInjuryStore = create<State>((set) => ({
  predictions: DEFAULT_MODEL_QUERY_STATE,
  setInjuryPredictions: (predictions) =>
    set((state) =>
      produce(state, (draftState: State) => {
        draftState.predictions = predictions;
      }),
    ),
}));
