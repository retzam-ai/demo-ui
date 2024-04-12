import { gql } from 'urql';

const TEST_SUPERVISED_LEARNING_MODELS = gql`
  mutation SupervisedLearningPrediction($model: String!, $input: [Float]!) {
    supervisedLearningPrediction(model: $model, input: $input) {
      prediction {
        result {
          knn
        }
      }
    }
  }
`;

export { TEST_SUPERVISED_LEARNING_MODELS };
