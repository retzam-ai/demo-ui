import { gql } from 'urql';

export const SUPERVISED_LEARNING_CLASSIFICATION_MODELS = gql`
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
          svm
          randomForest
        }
      }
    }
  }
`;

export const SUPERVISED_LEARNING_REGRESSION_MODELS = gql`
  mutation SupervisedLearningRegressionPrediction(
    $simple: [Float]!
    $multiple: [Float]!
  ) {
    supervisedLearningRegressionPrediction(
      simple: $simple
      multiple: $multiple
    ) {
      prediction {
        result {
          simpleLinearRegression
          multipleLinearRegression
        }
      }
    }
  }
`;
