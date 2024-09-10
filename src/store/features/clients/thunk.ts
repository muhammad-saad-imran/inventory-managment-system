import { createAsyncThunk } from "@reduxjs/toolkit";
import { completeLoading, startLoading } from "@/store/features/loading";
import { createSupabaseClient } from "@/utils/supabase/client";
import { ClientRepo } from "@/utils/database/ClientRepo";
import { Client } from "@/utils/database/types";

const FETCH_ALL_CLIENTS = "client/getAll";
const FETCH_CLIENT_BY_ID = "client/get";
const CREATE_CLIENT = "client/create";
const UPDATE_CLIENT = "client/update";
const DELETE_CLIENT = "client/delete";

const client = new ClientRepo(createSupabaseClient());

export const getAllClient = createAsyncThunk(
  FETCH_ALL_CLIENTS,
  async (clientName: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const allClientData = await client.getWithName(clientName);
      dispatch(completeLoading());
      return allClientData;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while fetching suppliers");
      rejectWithValue(error);
    }
  }
);

export const getClient = createAsyncThunk(
  FETCH_CLIENT_BY_ID,
  async (clientId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const clientData = await client.get(clientId);
      dispatch(completeLoading());
      return clientData;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while fetching supplier");
      rejectWithValue(error);
    }
  }
);

export const createClient = createAsyncThunk(
  CREATE_CLIENT,
  async (newClient: Client, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const clientData = await client.create(newClient);
      dispatch(completeLoading());
      return clientData;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while creating supplier");
      rejectWithValue(error);
    }
  }
);

export const updateClient = createAsyncThunk(
  UPDATE_CLIENT,
  async (clientValues: Client, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const clientData = await client.update(clientValues.id, clientValues);
      dispatch(completeLoading());
      return clientData;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while updating supplier");
      rejectWithValue(error);
    }
  }
);

export const deleteClient = createAsyncThunk(
  DELETE_CLIENT,
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      await client.delete(id);
      dispatch(completeLoading());
      return;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while deleting supplier");
      rejectWithValue(error);
    }
  }
);
