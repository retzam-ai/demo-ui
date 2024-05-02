import { DEFAULT_MODEL_QUERY_STATE } from '#/constants';
import { SupervisedLearningClassificationPredictionType } from '#/types';
import { create } from 'zustand';
import { produce } from 'immer';

type State = {
  predictions: SupervisedLearningClassificationPredictionType;
  setMachinesPredictions: (
    predictions: SupervisedLearningClassificationPredictionType,
  ) => void;
};

export const useMachinesStore = create<State>((set) => ({
  predictions: DEFAULT_MODEL_QUERY_STATE,
  setMachinesPredictions: (predictions) =>
    set((state) =>
      produce(state, (draftState: State) => {
        draftState.predictions = predictions;
      }),
    ),
}));
