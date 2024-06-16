'use client';

import { CLASSIFICATION_PREDICTION_MODELS } from '#/constants/prediction-models';
import { useCarsStore } from '#/store/cars-store';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { SupervisedLearningClassificationPredictionType } from '#/types';

export default function CarsModels() {
  return (
    <>
      {CLASSIFICATION_PREDICTION_MODELS.map((model) => (
        <PredictionModelsItem
          key={model.slug}
          slug={model.slug}
          model={model.name}
          image={model.image}
        />
      ))}
    </>
  );
}

interface PredictionModelsItemType {
  slug: string;
  model: string;
  image: string;
}

function PredictionModelsItem({
  slug,
  model,
  image,
}: PredictionModelsItemType) {
  const { predictions } = useCarsStore();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{model}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="overflow-auto rounded-md bg-gray-800 p-4 text-white">
          <pre>
            <code>Classification report</code>
            <Image
              src={`/models/cars/${image}`}
              width={300}
              height={300}
              alt="KNN"
            />
          </pre>
        </div>
        {predictions.triggered && (
          <div className=" overflow-auto rounded-md bg-gray-800 p-4 text-white">
            <p>Car Manufacturer:</p>
            {predictions.isLoading ? (
              '👽 Thinking...'
            ) : (
              <span className="flex items-center">
                <Check className="mx-1 bg-green-500" />{' '}
                {
                  predictions[
                    slug as keyof SupervisedLearningClassificationPredictionType
                  ]
                }{' '}
                🚙
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
