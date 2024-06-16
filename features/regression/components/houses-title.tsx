import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';

export default function HousesPageTitle() {
  return (
    <div>
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Houses models</AlertTitle>
        <AlertDescription>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="mt-4">
              For this demo project, we used a synthetic dataset of 50,000+
              houses data from..
            </p>
            <p>
              You will input a house&apos;s information like square feet,
              bathrooms, year built, etc, and each model would predict the price
              of the house.
            </p>
            <p>
              We got this dataset from Kaggle you can view and download{' '}
              <a
                className="font-bold text-blue-500"
                href="https://www.kaggle.com/datasets/muhammadbinimran/housing-price-prediction-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
            <p>
              Here is a jupyter notebook pdf with the code for the Linear
              Regression solution{' '}
              <a
                className="font-bold text-blue-500"
                href="/files/regression/Linear-regression-prediction-by-retzam-ai.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
