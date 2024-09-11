import { completeLoading, startLoading } from "@/store/features/loading";
import { createAsyncThunk, GetThunkAPI } from "@reduxjs/toolkit";

export const getThunkCreator = <T>(
  thunkName: string,
  getEntity: (id: string) => Promise<T>
) =>
  createAsyncThunk(
    thunkName,
    async (id: string, { dispatch, rejectWithValue }) => {
      try {
        dispatch(startLoading());
        const entity = await getEntity(id);
        dispatch(completeLoading());
        return entity;
      } catch (error) {
        dispatch(completeLoading());
        alert("Error fetching products");
        rejectWithValue(error);
      }
    }
  );

export const getAllThunkCreator = <T>(
  thunkName: string,
  getAllEntity: (input: string) => Promise<T[]>
) =>
  createAsyncThunk(
    thunkName,
    async (name: string, { dispatch, rejectWithValue }) => {
      try {
        dispatch(startLoading());
        const entity = await getAllEntity(name);
        dispatch(completeLoading());
        return entity;
      } catch (error) {
        dispatch(completeLoading());
        alert("Error fetching products");
        rejectWithValue(error);
      }
    }
  );

export const mutationThunkCreator = <T>(
  thunkName: string,
  mutateEntity: (values: T) => Promise<T>
) =>
  createAsyncThunk(
    thunkName,
    async (values: T, { dispatch, rejectWithValue }) => {
      try {
        dispatch(startLoading());
        const entity = await mutateEntity(values);
        dispatch(completeLoading());
        return entity;
      } catch (error) {
        dispatch(completeLoading());
        alert("Error fetching products");
        rejectWithValue(error);
      }
    }
  );

export const deleteThunkCreator = (
  thunkName: string,
  deleteEntity: (id: string) => Promise<void>
) =>
  createAsyncThunk(
    thunkName,
    async (id: string, { dispatch, rejectWithValue }) => {
      try {
        dispatch(startLoading());
        await deleteEntity(id);
        dispatch(completeLoading());
        return;
      } catch (error) {
        dispatch(completeLoading());
        alert("Error fetching products");
        rejectWithValue(error);
      }
    }
  );
