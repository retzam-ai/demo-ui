'use client';

import { REGRESSION_PREDICTION_MODELS } from '#/constants/prediction-models';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import Image from 'next/image';
import { SupervisedLearningRegressionPredictionType } from '#/types';
import { useHousesStore } from '#/store/regression/houses-store';

export default function HousesModels() {
  return (
    <>
      {REGRESSION_PREDICTION_MODELS.map((model) => (
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
  const { predictions } = useHousesStore();

  const getHousePrice = (prediction: string | boolean) => {
    if (typeof prediction === 'boolean') {
      return '👽 Prediction failed';
    }
    // Parse the string to get the array
    const arr = JSON.parse(prediction);
    // Access the first element and round it
    const integerPart = Math.round(arr[0]);

    return formatCurrency(integerPart);
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2, // Ensure at least 2 decimal places
      maximumFractionDigits: 2, // Ensure at most 2 decimal places
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{model}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="overflow-auto rounded-md bg-gray-800 p-4 text-white">
          <pre>
            <code>Regression score</code>
            <Image
              src={`/models/regression/houses/${image}`}
              width={300}
              height={300}
              alt="Linear Regression"
            />
          </pre>
        </div>
        {predictions.triggered && (
          <div className=" overflow-auto rounded-md bg-gray-800 p-4 text-white">
            <p>House Price:</p>
            {predictions.isLoading ? (
              '👽 Thinking...'
            ) : (
              <span className="flex items-center">
                {getHousePrice(
                  predictions[
                    slug as keyof SupervisedLearningRegressionPredictionType
                  ],
                )}{' '}
                🏠
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
