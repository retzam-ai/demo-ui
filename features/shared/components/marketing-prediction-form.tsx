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
import { marketingPredictionSchema } from '#/types';
import { useMutation } from 'urql';
import { SUPERVISED_LEARNING_CLASSIFICATION_MODELS } from '#/utils/graphql/mutations';
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
import { useMarketingStore } from '#/store/marketing-store';
import { GENDER, MARITAL_STATUS, YES_NO_OPTIONS } from '#/constants/marketing';

export default function MarketingPredictionForm() {
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
            Predict Marketing Response
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Predict Marketing Response</DialogTitle>
            <DialogDescription>
              Enter the client&rsquo;s details below to get a prediction if
              they&rsquo;ll respond to marketing or not.
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
          Predict Marketing Response
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-x-scroll">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Predict Marketing Response</DrawerTitle>
            <DrawerDescription>
              Enter the client&rsquo;s details below to get a prediction if
              they&rsquo;ll respond to marketing or not.
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
  const { predictions, setMarketingPredictions } = useMarketingStore();
  const [predictionResult, predictionMutation] = useMutation(
    SUPERVISED_LEARNING_CLASSIFICATION_MODELS,
  );

  const predictionState = cloneDeep(predictions);

  const form = useForm<z.infer<typeof marketingPredictionSchema>>({
    defaultValues: {},
    resolver: zodResolver(marketingPredictionSchema),
  });

  const onSubmit = async (data: z.infer<typeof marketingPredictionSchema>) => {
    predictionState.triggered = true;
    setMarketingPredictions({
      ...predictionState,
      triggered: predictionState.triggered,
    });

    // Create array of data in required order
    const input = [];
    input.push(data.age);
    input.push(parseInt(data.gender));
    input.push(data.annualIncome);
    input.push(data.creditScore);
    input.push(parseInt(data.employed));
    input.push(parseInt(data.maritalStatus));
    input.push(data.noOfChildren);

    const variables = {
      input: input,
    };

    // K-Nearest Neighbors Predicition
    onFormSubmitted();
    await predict(variables);
  };

  const predict = async (variables: { input: number[] }) => {
    predictionState.isLoading = true;
    setMarketingPredictions({
      ...predictionState,
      isLoading: predictionState.isLoading,
    });

    predictionMutation({ ...variables, dataset: 'marketing' }).then(
      (result) => {
        if (
          result.data?.supervisedLearningClassificationPrediction?.prediction
        ) {
          predictionState.knn =
            result.data.supervisedLearningClassificationPrediction.prediction.result.knn;
          predictionState.naiveBayes =
            result.data.supervisedLearningClassificationPrediction.prediction.result.naiveBayes;
          predictionState.logisticRegression =
            result.data.supervisedLearningClassificationPrediction.prediction.result.logisticRegression;
          predictionState.svm =
            result.data.supervisedLearningClassificationPrediction.prediction.result.svm;
          predictionState.randomForest =
            result.data.supervisedLearningClassificationPrediction.prediction.result.randomForest;

          setMarketingPredictions({
            ...predictionState,
            knn: predictionState.knn,
            naiveBayes: predictionState.naiveBayes,
            logisticRegression: predictionState.logisticRegression,
            svm: predictionState.svm,
            randomForest: predictionState.randomForest,
          });
        } else {
          predictionState.error =
            result.data?.supervisedLearningClassificationPrediction?.errors[0]?.message;
          setMarketingPredictions({
            ...predictionState,
            error: predictionState.error,
          });
        }

        predictionState.isLoading = false;
        setMarketingPredictions({
          ...predictionState,
          isLoading: predictionState.isLoading,
        });
      },
    );
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
                          placeholder="e.g 30"
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
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="annualIncome" className="text-right">
                        Annual Income($)
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 25000"
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
                  name="creditScore"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="creditScore" className="text-right">
                        Credit Score
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 500"
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
                  name="noOfChildren"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="noOfChildren" className="text-right">
                        Number Of Children
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Gender</Label>

                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-auto text-left">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDER?.map((item, index) => (
                              <SelectItem key={index} value={item.value}>
                                <div>
                                  <h3 className="font-medium">{item.label}</h3>
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
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Marital status</Label>

                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-auto text-left">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {MARITAL_STATUS?.map((item, index) => (
                              <SelectItem key={index} value={item.value}>
                                <div>
                                  <h3 className="font-medium">{item.label}</h3>
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

            <div className="my-2 grid grid-cols-12 gap-4 space-x-2">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="employed"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Employed</Label>

                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-auto text-left">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {YES_NO_OPTIONS?.map((item, index) => (
                              <SelectItem key={index} value={item.value}>
                                <div>
                                  <h3 className="font-medium">{item.label}</h3>
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
