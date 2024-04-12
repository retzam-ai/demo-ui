import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';

export default function SupervisedLearningPageTitle() {
  return (
    <div>
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Supervised Learning Models</AlertTitle>
        <AlertDescription>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="mt-4">
              For this demo project, we used a dataset of 90,000+ cars data from
              1970 to 2024.
            </p>
            <p>
              You will input a car&apos;s information like manufacturing price,
              year, mileage, mpg engine size etc, and each model would predict
              the manufacturer of the car.
            </p>
            <p>
              We got this dataset from Kaggle you can view and download{' '}
              <a
                className="font-bold text-blue-500"
                href="https://www.kaggle.com/datasets/meruvulikith/90000-cars-data-from-1970-to-2024"
              >
                here
              </a>
              .
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
