import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';

export default function MarketingPageTitle() {
  return (
    <div>
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Marketing campaign response models</AlertTitle>
        <AlertDescription>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="mt-4">
              For this demo project, we used a dataset about 6,000 marketing
              campaign data.
            </p>
            <p>
              You will input a client&apos;s information like age, income
              marital status, etc, and each model would predict if the client
              would respond to the marketing campaign or not.
            </p>
            <p>
              We got this dataset from Kaggle you can view and download{' '}
              <a
                className="font-bold text-blue-500"
                href="https://www.kaggle.com/datasets/sujithmandala/marketing-campaign-positive-response-prediction"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
            <p>
              Here is a jupyter notebook pdf with the code for the Logistic
              Regression solution{' '}
              <a
                className="font-bold text-blue-500"
                href="/files/SVM-prediction-by-retzam-ai.pdf"
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
