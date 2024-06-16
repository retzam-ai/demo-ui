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
import { carsPredictionSchema, diabetesPredictionSchema } from '#/types';
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
import { useDiabetesStore } from '#/store/diabetes-store';
import { GENDER, SMOKING_HISTORY } from '#/constants/diabetes';

export default function DiabetesPredictionForm() {
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
            Predict Diabetes Diagnosis
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Predict Diabetes Diagnosis</DialogTitle>
            <DialogDescription>
              Enter the patient details below to get a prediction for their
              diabetes diagnosis
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
          Predict Diabetes Diagnosis
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-x-scroll">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Predict Diabetes Diagnosis</DrawerTitle>
            <DrawerDescription>
              Enter the patient details below to get a prediction for their
              diabetes diagnosis
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
  const { predictions, setDiabetesPredictions } = useDiabetesStore();
  const [predictionResult, predictionMutation] = useMutation(
    SUPERVISED_LEARNING_CLASSIFICATION_MODELS,
  );

  const predictionState = cloneDeep(predictions);

  const form = useForm<z.infer<typeof diabetesPredictionSchema>>({
    defaultValues: {},
    resolver: zodResolver(diabetesPredictionSchema),
  });

  const onSubmit = async (data: z.infer<typeof diabetesPredictionSchema>) => {
    predictionState.triggered = true;
    setDiabetesPredictions({
      ...predictionState,
      triggered: predictionState.triggered,
    });

    // Create array of data in required order
    const input = [];
    input.push(parseInt(data.gender));
    input.push(data.age);
    input.push(data.hypertension);
    input.push(data.heartDisease);
    input.push(parseInt(data.smokingHistory));
    input.push(data.bmi);
    input.push(data.HbA1c);
    input.push(data.bloodGlucoseLevel);

    const variables = {
      input: input,
    };

    // K-Nearest Neighbors Predicition
    onFormSubmitted();
    await predict(variables);
  };

  const predict = async (variables: { input: number[] }) => {
    predictionState.isLoading = true;
    setDiabetesPredictions({
      ...predictionState,
      isLoading: predictionState.isLoading,
    });

    predictionMutation({ ...variables, dataset: 'diabetes' }).then((result) => {
      if (result.data?.supervisedLearningClassificationPrediction?.prediction) {
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

        setDiabetesPredictions({
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
        setDiabetesPredictions({
          ...predictionState,
          error: predictionState.error,
        });
      }

      predictionState.isLoading = false;
      setDiabetesPredictions({
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
                          placeholder="e.g 37"
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
                  name="bmi"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="bmi" className="text-right">
                        BMI
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 45"
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
                  name="hypertension"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="hypertension" className="text-right">
                        Hypertension
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
                  name="HbA1c"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="HbA1c" className="text-right">
                        HbA1c
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 5"
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
                  name="bloodGlucoseLevel"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="bloodGlucoseLevel" className="text-right">
                        Blood Glucose Level
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 130"
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
                  name="heartDisease"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="heartDisease" className="text-right">
                        Heart Disease
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 0"
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
                            {GENDER.map((item, index) => (
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
                  name="smokingHistory"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Smoking History</Label>

                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-auto text-left">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {SMOKING_HISTORY.map((type, index) => (
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
