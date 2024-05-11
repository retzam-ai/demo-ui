'use client';

import { PREDICTION_MODELS } from '#/constants/prediction-models';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import Image from 'next/image';
import { SupervisedLearningClassificationPredictionType } from '#/types';
import { cloneDeep } from 'lodash';
import { useMachinesStore } from '#/store/machines-store';

export default function MachineModels() {
  const clone = cloneDeep(PREDICTION_MODELS);
  const slugToSwap = 'logisticRegression';
  const indexToSwap = clone.findIndex((item) => item.slug === slugToSwap);

  if (indexToSwap !== -1) {
    [clone[0], clone[indexToSwap]] = [clone[indexToSwap], clone[0]];
  }

  return (
    <>
      {clone.map((model) => (
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
  const { predictions } = useMachinesStore();
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
              src={`/models/machines/${image}`}
              width={300}
              height={300}
              alt="KNN"
            />
          </pre>
        </div>
        {predictions.triggered && (
          <div className=" overflow-auto rounded-md bg-gray-800 p-4 text-white">
            <p>Would machine fail?</p>
            {predictions.isLoading ? (
              '👽 Thinking...'
            ) : (
              <span className="flex items-center">
                🚜{' '}
                {
                  predictions[
                    slug as keyof SupervisedLearningClassificationPredictionType
                  ]
                }{' '}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
