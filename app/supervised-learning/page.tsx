import { ExternalLink } from '#/ui/external-link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Supervised Learning Models</h1>

      <p>This page aims to illustrate supervised learning models</p>
      <p>
        This shows the precision, recall and accuracy of the model. <br />
        It also shows prediction results for each model.
      </p>

      <ul>
        <li>
          We have a test as well to show how the model works in prediction.
        </li>
        <li>
          For this test, we used a dataset of 90,000+ cars data from 1970 to
          2024.
        </li>
        <li>
          {' '}
          You will input a car&apos;s information like manufacturing price,
          year, mileage, mpg engine size etc. and each model would predict the
          manufacturer of the car.
        </li>
        <li>
          We got this dataset from Kaggle you can view and download{' '}
          <a
            className="font-bold text-blue-500"
            href="https://www.kaggle.com/datasets/meruvulikith/90000-cars-data-from-1970-to-2024"
          >
            here
          </a>
          .
        </li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/vercel/app-playground/tree/main/app/layouts">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
