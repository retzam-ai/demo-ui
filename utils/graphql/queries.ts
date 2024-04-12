import { gql } from 'urql';

const GET_SUPERVISED_LEARNING_MODELS = gql`
  query SupervisedLearningPrediction($model: String) {
    supervisedLearningPrediction(model: $model) {
      result {
        knn
      }
    }
  }
`;

export { GET_SUPERVISED_LEARNING_MODELS };
