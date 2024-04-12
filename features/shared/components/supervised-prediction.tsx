'use client';

import { Button } from '#/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '#/components/ui/drawer';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '#/components/ui/form';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  SupervisedLearningPredictionModelsSchema,
  supervisedLearningPredictionSchema,
} from '#/types';
import { useMutation } from 'urql';
import { TEST_SUPERVISED_LEARNING_MODELS } from '#/utils/graphql/mutations';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { CAR_FUEL_TYPES, CAR_TRANSMISSIONS } from '#/features/knn/constants';

interface SupervisedLearningPredictionProps {
  predictions: SupervisedLearningPredictionModelsSchema;
  onPredictionTriggered: (
    predictions: SupervisedLearningPredictionModelsSchema,
  ) => void;
}

export default function SupervisedPrediction({
  predictions,
  onPredictionTriggered,
}: SupervisedLearningPredictionProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [predictionResult, predictionMutation] = useMutation(
    TEST_SUPERVISED_LEARNING_MODELS,
  );

  const form = useForm<z.infer<typeof supervisedLearningPredictionSchema>>({
    defaultValues: {},
    resolver: zodResolver(supervisedLearningPredictionSchema),
  });

  const onSubmit = (
    data: z.infer<typeof supervisedLearningPredictionSchema>,
  ) => {
    predictions.triggered = true;
    onPredictionTriggered(predictions);

    // Create array of data in required order
    const input = [6];
    input.push(data.year);
    input.push(data.price);
    input.push(parseInt(data.transmission));
    input.push(data.mileage);
    input.push(parseInt(data.fuelType));
    input.push(data.tax);
    input.push(data.mpg);
    input.push(data.engineSize);

    const variables = {
      input: input,
    };

    // K-Nearest Neighbors Predicition
    predictKNN(variables);
    setDrawerOpen(false);
  };

  const predictKNN = (variables: { input: number[] }) => {
    predictions.knn.isLoading = predictionResult.fetching;
    onPredictionTriggered(predictions);

    predictionMutation({ ...variables, model: 'knn' }).then((result) => {
      if (result.data?.supervisedLearningPrediction?.prediction) {
        predictions.knn.prediction =
          result.data.supervisedLearningPrediction.prediction.result.knn;
      } else {
        predictions.knn.error =
          result.data?.supervisedLearningPrediction?.errors[0]?.message;
      }
    });

    predictions.knn.isLoading = predictionResult.fetching;
    onPredictionTriggered(predictions);
  };

  return (
    <Drawer open={drawerOpen}>
      <DrawerTrigger asChild>
        <Button
          className="m-2"
          variant="outline"
          onClick={() => setDrawerOpen(true)}
        >
          Predict Car Manufacturer
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Predict Car Manufacturer</DrawerTitle>
            <DrawerDescription>
              Enter the car details below to get a prediction for the car
              manufacturer
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-4">
                        <Label htmlFor="year" className="text-right">
                          Year
                        </Label>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="e.g 1999"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-4">
                        <Label htmlFor="price" className="text-right">
                          Price
                        </Label>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            placeholder="e.g 15,000"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Transmission</Label>

                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-auto text-left">
                              <SelectValue placeholder="Manual" />
                            </SelectTrigger>
                            <SelectContent>
                              {CAR_TRANSMISSIONS?.map((transmission, index) => (
                                <SelectItem
                                  key={index}
                                  value={transmission.value}
                                >
                                  <div>
                                    <h3 className="font-medium">
                                      {transmission.label}
                                    </h3>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Fuel Type</Label>

                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-auto text-left">
                              <SelectValue placeholder="Manual" />
                            </SelectTrigger>
                            <SelectContent>
                              {CAR_FUEL_TYPES?.map((type, index) => (
                                <SelectItem key={index} value={type.value}>
                                  <div>
                                    <h3 className="font-medium">
                                      {type.label}
                                    </h3>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-4">
                        <Label htmlFor="mileage" className="text-right">
                          Mileage
                        </Label>
                        <FormControl>
                          <Input type="number" {...field} placeholder="e.g 1" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-4">
                        <Label htmlFor="tax" className="text-right">
                          Tax
                        </Label>
                        <FormControl>
                          <Input type="number" {...field} placeholder="e.g 5" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mpg"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-4">
                        <Label htmlFor="mpg" className="text-right">
                          MPG
                        </Label>
                        <FormControl>
                          <Input type="number" {...field} placeholder="e.g 5" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="engineSize"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-4">
                        <Label htmlFor="engineSize" className="text-right">
                          Engine Size
                        </Label>
                        <FormControl>
                          <Input type="number" {...field} placeholder="e.g 5" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DrawerFooter>
                    <Button
                      className="h-10 w-full"
                      size="xxs"
                      variant="secondary"
                      type="submit"
                    >
                      Submit
                    </Button>
                    <DrawerClose asChild>
                      <Button
                        onClick={() => setDrawerOpen(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}