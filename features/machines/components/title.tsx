import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';

export default function MachinesPageTitle() {
  return (
    <div>
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Machines failure models</AlertTitle>
        <AlertDescription>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="mt-4">
              For this demo project, we used a dataset of about 10,000 machines
              with combustion engines data.
            </p>
            <p>
              You will input a machines&apos;s information like torque, tool
              wear, rotation speed, etc, and each model would predict if the
              machine would have a failure or not.
            </p>
            <p>
              We got this dataset from Kaggle you can view and download{' '}
              <a
                className="font-bold text-blue-500"
                href="https://www.kaggle.com/datasets/ikjotsingh221/machine-failure-cleaned"
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
                href="/files/Logistic-Regression-prediction-by-retzam-ai.pdf"
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
