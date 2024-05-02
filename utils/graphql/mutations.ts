import { gql } from 'urql';

const TEST_SUPERVISED_LEARNING_MODELS = gql`
  mutation SupervisedLearningClassificationPrediction(
    $dataset: String!
    $input: [Float]!
  ) {
    supervisedLearningClassificationPrediction(
      dataset: $dataset
      input: $input
    ) {
      prediction {
        result {
          knn
          naiveBayes
          logisticRegression
        }
      }
    }
  }
`;

export { TEST_SUPERVISED_LEARNING_MODELS };
