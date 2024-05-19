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
import { carsPredictionSchema, machinesPredictionSchema } from '#/types';
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
import { useMachinesStore } from '#/store/machines-store';

export default function MachinesPredictionForm() {
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
            Predict Machine Failure
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Predict Machine Failure</DialogTitle>
            <DialogDescription>
              Enter the machine&rsquo;s details below to get a prediction if
              it&rsquo;ll fail or not.
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
          Predict Machine Failure
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-x-scroll">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Predict Machine Failure</DrawerTitle>
            <DrawerDescription>
              Enter the machine&rsquo;s details below to get a prediction if
              it&rsquo;ll fail or not.
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
  const { predictions, setMachinesPredictions } = useMachinesStore();
  const [predictionResult, predictionMutation] = useMutation(
    TEST_SUPERVISED_LEARNING_MODELS,
  );

  const predictionState = cloneDeep(predictions);

  const form = useForm<z.infer<typeof machinesPredictionSchema>>({
    defaultValues: {},
    resolver: zodResolver(machinesPredictionSchema),
  });

  const onSubmit = async (data: z.infer<typeof machinesPredictionSchema>) => {
    predictionState.triggered = true;
    setMachinesPredictions({
      ...predictionState,
      triggered: predictionState.triggered,
    });

    // Create array of data in required order
    const input = [];
    input.push(data.rotationSpeed);
    input.push(data.torque);
    input.push(data.toolWear);
    input.push(data.twf);
    input.push(data.hdf);
    input.push(data.pwf);
    input.push(data.osf);

    const variables = {
      input: input,
    };

    // K-Nearest Neighbors Predicition
    onFormSubmitted();
    await predict(variables);
  };

  const predict = async (variables: { input: number[] }) => {
    predictionState.isLoading = true;
    setMachinesPredictions({
      ...predictionState,
      isLoading: predictionState.isLoading,
    });

    predictionMutation({ ...variables, dataset: 'machines' }).then((result) => {
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

        setMachinesPredictions({
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
        setMachinesPredictions({
          ...predictionState,
          error: predictionState.error,
        });
      }

      predictionState.isLoading = false;
      setMachinesPredictions({
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
                  name="rotationSpeed"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="rotationSpeed" className="text-right">
                        Rotation speed
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
                  name="torque"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="torque" className="text-right">
                        Torque
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
            </div>

            <div className="my-2 grid grid-cols-12 gap-4 space-x-2">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="toolWear"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="toolWear" className="text-right">
                        Tool wear
                      </Label>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="e.g 100"
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
                  name="twf"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="twf" className="text-right">
                        TWF
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
                  name="pwf"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="pwf" className="text-right">
                        PWF
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

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="osf"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="osf" className="text-right">
                        OSF
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
                  name="hdf"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-between space-x-4">
                      <Label htmlFor="hdf" className="text-right">
                        HDF
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
