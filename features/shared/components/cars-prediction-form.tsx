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
import { carsPredictionSchema } from '#/types';
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
import { CAR_FUEL_TYPES, CAR_TRANSMISSIONS } from '#/constants/cars';
import useMediaQuery from '#/hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import { useCarsStore } from '#/store/cars-store';
import { cloneDeep } from 'lodash';

export default function CarsPredictionForm() {
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
            Predict Car Manufacturer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Predict Car Manufacturer</DialogTitle>
            <DialogDescription>
              Enter the car details below to get a prediction for the car
              manufacturer.
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
          Predict Car Manufacturer
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-x-scroll">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Predict Car Manufacturer</DrawerTitle>
            <DrawerDescription>
              Enter the car details below to get a prediction for the car
              manufacturer
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
  const { predictions, setCarsPredictions } = useCarsStore();
  const [predictionResult, predictionMutation] = useMutation(
    TEST_SUPERVISED_LEARNING_MODELS,
  );

  const predictionState = cloneDeep(predictions);

  const form = useForm<z.infer<typeof carsPredictionSchema>>({
    defaultValues: {},
    resolver: zodResolver(carsPredictionSchema),
  });

  const onSubmit = async (data: z.infer<typeof carsPredictionSchema>) => {
    predictionState.triggered = true;
    setCarsPredictions({
      ...predictionState,
      triggered: predictionState.triggered,
    });

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
    onFormSubmitted();
    await predict(variables);
  };

  const predict = async (variables: { input: number[] }) => {
    predictionState.isLoading = true;
    setCarsPredictions({
      ...predictionState,
      isLoading: predictionState.isLoading,
    });

    predictionMutation({ ...variables, dataset: 'cars' }).then((result) => {
      if (result.data?.supervisedLearningClassificationPrediction?.prediction) {
        predictionState.knn =
          result.data.supervisedLearningClassificationPrediction.prediction.result.knn;
        predictionState.naiveBayes =
          result.data.supervisedLearningClassificationPrediction.prediction.result.naiveBayes;
        predictionState.logisticRegression =
          result.data.supervisedLearningClassificationPrediction.prediction.result.logisticRegression;

        setCarsPredictions({
          ...predictionState,
          knn: predictionState.knn,
          naiveBayes: predictionState.naiveBayes,
          logisticRegression: predictionState.logisticRegression,
        });
      } else {
        predictionState.error =
          result.data?.supervisedLearningClassificationPrediction?.errors[0]?.message;
        setCarsPredictions({
          ...predictionState,
          error: predictionState.error,
        });
      }

      predictionState.isLoading = false;
      setCarsPredictions({
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
                  name="year"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="year" className="text-right">
                        Year
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 1999"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="price" className="text-right">
                        Price(€)
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 15,000"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="my-2 grid grid-cols-12 gap-4 space-x-2">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="mileage" className="text-right">
                        Mileage
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 1"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="tax" className="text-right">
                        Tax(€)
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 5"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="my-2 grid grid-cols-12 gap-4 space-x-2">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="mpg"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="mpg" className="text-right">
                        MPG
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 5"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="engineSize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="engineSize" className="text-right">
                        Engine Size
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 5"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="my-2 grid grid-cols-12 gap-4 space-x-2">
              <div className="col-span-6">
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
              </div>

              <div className="col-span-6">
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
                                  <h3 className="font-medium">{type.label}</h3>
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
