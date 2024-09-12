import { createAsyncThunk } from "@reduxjs/toolkit";
import { completeLoading, startLoading } from "@/store/features/loading";

const handleThunkProcessing = async <TReturn>(
  errorMessage: string,
  thunkFunc: () => Promise<TReturn>,
  { dispatch }: { dispatch: any }
): Promise<TReturn> => {
  try {
    dispatch(startLoading());
    const data = await thunkFunc();
    dispatch(completeLoading());
    return data;
  } catch (error) {
    dispatch(completeLoading());
    alert(errorMessage);
    throw error;
  }
};

export const customThunkCreator = <TInput, TReturn>(
  thunkName: string,
  thunkErrorMessage: string,
  thunkFunc: (input: TInput) => Promise<TReturn>
) =>
  createAsyncThunk(thunkName, async (input: TInput, thunkApi) => {
    return handleThunkProcessing<TReturn>(
      thunkErrorMessage,
      async () => thunkFunc(input),
      thunkApi
    );
  });
