import { SupervisedLearningClassificationPredictionType } from '#/types';
import { Metadata } from 'next';

export const DEFAULT_MODEL_QUERY_STATE: SupervisedLearningClassificationPredictionType =
  {
    knn: '',
    naiveBayes: '',
    logisticRegression: '',
    svm: '',
    randomForest: '',
    triggered: false,
    isLoading: false,
    error: '',
  };

export const DEFAULT_REGRESSION_MODEL_QUERY_STATE = {
  simpleLinearRegression: '',
  multipleLinearRegression: '',
  triggered: false,
  isLoading: false,
  error: '',
};

export const metadata: Metadata = {
  title: {
    default: 'retzam.ai playground',
    template: '%s | Next.js App Router',
  },
  description:
    'A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.',
  openGraph: {
    title: 'Next.js App Router Playground',
    description:
      'A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.',
    images: [`/api/og?title=Next.js App Router`],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const WEBSITE_NAME = 'retzam.ai - playground';
export const WEBSITE_AUTHOR = 'retzam.ai';

// export const SERVER_URL = 'http://localhost:8000/graphql';
export const SERVER_URL = 'https://api.retzam.info/graphql';
