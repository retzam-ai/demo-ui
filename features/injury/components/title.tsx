import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';

export default function InjuryPageTitle() {
  return (
    <div>
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Injury models</AlertTitle>
        <AlertDescription>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="mt-4">
              For this demo project, we used a synthetic dataset of a thousand
              football players.
            </p>
            <p>
              You will input a football player&apos;s information like age,
              weight, height etc, and each model would predict if the player
              would be injured in their next match or not.
            </p>
            <p>
              We got this dataset from Kaggle you can view and download{' '}
              <a
                className="font-bold text-blue-500"
                href="https://www.kaggle.com/datasets/mrsimple07/injury-prediction-dataset"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
            <p>
              Here is a jupyter notebook pdf with the code for the Naive Bayes
              solution{' '}
              <a
                className="font-bold text-blue-500"
                href="/files/Naive-Bayes-prediction-by-retzam-ai.pdf"
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
