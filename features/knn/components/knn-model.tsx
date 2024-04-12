'use client';

import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Check } from 'lucide-react';
import Image from 'next/image';

interface Props {
  isLoading: boolean;
  prediction: string;
  trigger: boolean;
}

export default function KNNModel(props: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>K-Nearest Neighbors</CardTitle>
      </CardHeader>
      <CardContent>
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
        {props.trigger && (
          <div className="overflow-auto rounded-md bg-gray-800 p-4 text-white">
            <p>Car Manufacturer:</p>
            {props.isLoading ? (
              'Thinking...'
            ) : (
              <span className="flex items-center">
                <Check className="bg-green-500" /> {props.prediction}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
