'use client';

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { useSupervisedLearningPredictionStore } from '#/store/supervised-learning-predictions';
import { Check } from 'lucide-react';
import Image from 'next/image';

export default function KNNModel() {
  const { predictions } = useSupervisedLearningPredictionStore();
  return (
    <Card>
      <CardHeader>
        <CardTitle>K-Nearest Neighbors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="overflow-auto rounded-md bg-gray-800 p-4 text-white">
          <pre>
            <code>Classification report</code>
            <Image
              src="/models/cars-evaluation-knn.png"
              width={300}
              height={300}
              alt="KNN"
            />
          </pre>
        </div>
        {predictions.triggered && (
          <div className=" overflow-auto rounded-md bg-gray-800 p-4 text-white">
            <p>Car Manufacturer:</p>
            {predictions.knn.isLoading ? (
              'Thinking...'
            ) : (
              <span className="flex items-center">
                <Check className="bg-green-500" /> 🚙{' '}
                {predictions.knn.prediction}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
