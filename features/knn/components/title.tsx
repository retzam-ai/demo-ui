import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';

export default function SupervisedLearningPageTitle() {
  return (
    <div>
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Supervised Learning Models</AlertTitle>
        <AlertDescription>
          <p>This page aims to illustrate supervised learning models.</p>
          <p>
            This shows the precision, recall and accuracy of the model. <br />
            It also shows prediction results for each model.
          </p>
          <p className="mt-4">
            We have a test as well to show how the model works in prediction.{' '}
            <br />
            For this test, we used a dataset of 90,000+ cars data from 1970 to
            2024.
            <br />
            <br />
            You will input a car&apos;s information like manufacturing price,
            year, mileage, mpg engine size etc. and each model would predict the
            manufacturer of the car. <br />
            We got this dataset from Kaggle you can view and download{' '}
            <a
              className="font-bold text-blue-500"
              href="https://www.kaggle.com/datasets/meruvulikith/90000-cars-data-from-1970-to-2024"
            >
              here
            </a>
            .
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}