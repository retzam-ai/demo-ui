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
import { Form, FormField, FormItem, FormControl } from '#/components/ui/form';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { injuryPredictionSchema } from '#/types';
import { useMutation } from 'urql';
import { TEST_SUPERVISED_LEARNING_MODELS } from '#/utils/graphql/mutations';
import { useState } from 'react';
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
import { useInjuryStore } from '#/store/injury-store';

export default function InjuryPredictionForm() {
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
            Predict Player Injury
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Predict Player Injury</DialogTitle>
            <DialogDescription>
              Enter the player&apos;s details below to get a prediction for next
              match, whether the player would be injured or not.
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
          Predict Player Injury
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-x-scroll">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Predict Player Injury</DrawerTitle>
            <DrawerDescription>
              Enter the player&apos;s details below to get a prediction for next
              match, whether the player would be injured or not.
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
  const { predictions, setInjuryPredictions } = useInjuryStore();
  const [predictionResult, predictionMutation] = useMutation(
    TEST_SUPERVISED_LEARNING_MODELS,
  );

  const predictionState = cloneDeep(predictions);

  const form = useForm<z.infer<typeof injuryPredictionSchema>>({
    defaultValues: {},
    resolver: zodResolver(injuryPredictionSchema),
  });

  const onSubmit = async (data: z.infer<typeof injuryPredictionSchema>) => {
    predictionState.triggered = true;
    setInjuryPredictions({
      ...predictionState,
      triggered: predictionState.triggered,
    });

    // Create array of data in required order
    const input = [];
    input.push(data.age);
    input.push(data.weight);
    input.push(data.height);
    input.push(data.previousInjuries);
    input.push(data.trainingIntensity);
    input.push(data.recoveryTime);

    const variables = {
      input: input,
    };

    // K-Nearest Neighbors Predicition
    onFormSubmitted();
    await predict(variables);
  };

  const predict = async (variables: { input: number[] }) => {
    predictionState.isLoading = true;
    setInjuryPredictions({
      ...predictionState,
      isLoading: predictionState.isLoading,
    });

    predictionMutation({ ...variables, dataset: 'injury' }).then((result) => {
      if (result.data?.supervisedLearningClassificationPrediction?.prediction) {
        predictionState.knn =
          result.data.supervisedLearningClassificationPrediction.prediction.result.knn;
        predictionState.naiveBayes =
          result.data.supervisedLearningClassificationPrediction.prediction.result.naiveBayes;
        predictionState.logisticRegression =
          result.data.supervisedLearningClassificationPrediction.prediction.result.logisticRegression;

        setInjuryPredictions({
          ...predictionState,
          knn: predictionState.knn,
          naiveBayes: predictionState.naiveBayes,
          logisticRegression: predictionState.logisticRegression,
        });
      } else {
        predictionState.error =
          result.data?.supervisedLearningClassificationPrediction?.errors[0]?.message;
        setInjuryPredictions({
          ...predictionState,
          error: predictionState.error,
        });
      }

      predictionState.isLoading = false;
      setInjuryPredictions({
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
                  name="age"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="age" className="text-right">
                        Age
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 25"
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
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="weight" className="text-right">
                        Weight(kg)
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 80.54"
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
                  name="height"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="height" className="text-right">
                        Height(cm)
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 177.23"
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
                  name="previousInjuries"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="previousInjuries" className="text-right">
                        Previous Injuries
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="0 or 1"
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
                  name="trainingIntensity"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="trainingIntensity" className="text-right">
                        Training Intensity
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 0.56"
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
                  name="recoveryTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="recoveryTime" className="text-right">
                        Recovery Time
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
