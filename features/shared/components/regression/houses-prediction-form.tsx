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
import { useMutation } from 'urql';
import { SUPERVISED_LEARNING_REGRESSION_MODELS } from '#/utils/graphql/mutations';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import useMediaQuery from '#/hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import { cloneDeep } from 'lodash';
import { housePredictionSchema } from '#/types/regression';
import { useHousesStore } from '#/store/regression/houses-store';
import { NEIGHBORHOODS } from '#/constants/regression/houses';

export default function HousesPredictionForm() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const onFormSubmitted = () => {
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full bg-white text-black">
            Predict House Price
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Predict House Price</DialogTitle>
            <DialogDescription>
              Enter house details below to get a price prediction.
            </DialogDescription>
          </DialogHeader>
          <SupervisedPredictionForm {...{ onFormSubmitted }} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full bg-white text-black" variant="outline">
          Predict House Price
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-x-scroll">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Predict House Price</DrawerTitle>
            <DrawerDescription>
              Enter house details below to get a price prediction.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-auto">
            <SupervisedPredictionForm {...{ onFormSubmitted }} />
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface SupervisedPredictionFormProps {
  onFormSubmitted: () => void;
}

function SupervisedPredictionForm({
  onFormSubmitted,
}: SupervisedPredictionFormProps) {
  const { predictions, setHousesPredictions } = useHousesStore();
  const [predictionResult, predictionMutation] = useMutation(
    SUPERVISED_LEARNING_REGRESSION_MODELS,
  );

  const predictionState = cloneDeep(predictions);

  const form = useForm<z.infer<typeof housePredictionSchema>>({
    defaultValues: {},
    resolver: zodResolver(housePredictionSchema),
  });

  const onSubmit = async (data: z.infer<typeof housePredictionSchema>) => {
    predictionState.triggered = true;
    setHousesPredictions({
      ...predictionState,
      triggered: predictionState.triggered,
    });

    // Create array of data in required order
    const input = [];
    input.push(data.squareFeet);
    input.push(data.bedrooms);
    input.push(data.bathrooms);
    input.push(data.yearBuilt);
    input.push(parseInt(data.neigborhood));

    const params = {
      simple: [data.squareFeet],
      multiple: input,
    };

    // K-Nearest Neighbors Prediction
    onFormSubmitted();
    await predict(params);
  };

  const predict = async (params: { simple: number[]; multiple: number[] }) => {
    predictionState.isLoading = true;
    setHousesPredictions({
      ...predictionState,
      isLoading: predictionState.isLoading,
    });

    predictionMutation(params).then((result) => {
      if (result.data?.supervisedLearningRegressionPrediction?.prediction) {
        predictionState.simpleLinearRegression =
          result.data.supervisedLearningRegressionPrediction.prediction.result.simpleLinearRegression;
        predictionState.multipleLinearRegression =
          result.data.supervisedLearningRegressionPrediction.prediction.result.multipleLinearRegression;

        setHousesPredictions({
          ...predictionState,
          simpleLinearRegression: predictionState.simpleLinearRegression,
          multipleLinearRegression: predictionState.multipleLinearRegression,
        });
      } else {
        predictionState.error =
          result.data?.supervisedLearningClassificationPrediction?.errors[0]?.message;
        setHousesPredictions({
          ...predictionState,
          error: predictionState.error,
        });
      }

      predictionState.isLoading = false;
      setHousesPredictions({
        ...predictionState,
        isLoading: predictionState.isLoading,
      });
    });
  };

  return (
    <div className="p-4 pb-0">
      <div className="flex items-center justify-center space-x-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="my-2 grid grid-cols-12 gap-4 space-x-2">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="squareFeet"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="year" className="text-right">
                        Square Feet
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 2500"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="price" className="text-right">
                        Bedrooms
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 2"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="my-2 grid grid-cols-12 gap-4 space-x-2">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="mileage" className="text-right">
                        Bathrooms
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 1"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="yearBuilt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="mpg" className="text-right">
                        Year Built
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 2001"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="my-2 grid grid-cols-12 gap-4 space-x-2">
              <div className="col-span-12 flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="neigborhood"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Neighborhood</Label>

                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-auto text-left">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {NEIGHBORHOODS?.map((neighborhood, index) => (
                              <SelectItem
                                key={index}
                                value={neighborhood.value}
                              >
                                <div>
                                  <h3 className="font-medium">
                                    {neighborhood.label}
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
              </div>
            </div>

            <div className="my-4 flex justify-center">
              <Button
                type="submit"
                variant="outline"
                className="w-full bg-white text-black"
              >
                Submit for prediction
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
