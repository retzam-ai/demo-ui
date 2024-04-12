import { Metadata } from 'next';

export const DEFAULT_MODEL_QUERY_STATE = {
  knn: {
    isLoading: false,
    prediction: '',
    error: '',
  },
  triggered: false,
};

export const metadata: Metadata = {
  title: {
    default: 'Next.js App Router',
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

export const WEBSITE_NAME = 'retzam.ai - Demo';
export const WEBSITE_AUTHOR = 'retzam.ai';

// export const SERVER_URL = "http://localhost:8000/graphql";
export const SERVER_URL = 'https://api.retzam.info/graphql';