import {
  DEFAULT_MODEL_QUERY_STATE,
  DEFAULT_REGRESSION_MODEL_QUERY_STATE,
} from '#/constants';
import { SupervisedLearningRegressionPredictionType } from '#/types';
import { create } from 'zustand';
import { produce } from 'immer';

type State = {
  predictions: SupervisedLearningRegressionPredictionType;
  setHousesPredictions: (
    predictions: SupervisedLearningRegressionPredictionType,
  ) => void;
};

export const useHousesStore = create<State>((set) => ({
  predictions: DEFAULT_REGRESSION_MODEL_QUERY_STATE,
  setHousesPredictions: (predictions) =>
    set((state) =>
      produce(state, (draftState: State) => {
        draftState.predictions = predictions;
      }),
    ),
}));
