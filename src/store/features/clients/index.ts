import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Client } from "@/utils/database/types";
import {
  getAllClient,
  getClient,
  updateClient,
} from "@/store/features/clients/thunk";

interface ClientState {
  client: Client;
  allClients: Client[];
}

const initialState = {
  client: {
    id: "",
    name: "",
    email: "",
    phone_number: 0,
    created_at: "",
  },
  allClients: [],
} satisfies ClientState as ClientState;

const ClientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.allClients = action.payload;
        }
      })
      .addCase(getClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.client = action.payload;
        }
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.client = action.payload;
        }
      });
  },
});

export const {} = ClientSlice.actions;
export default ClientSlice.reducer;

export const selectClient = (state: RootState) => state.client.client;
export const selectAllClients = (state: RootState) => state.client.allClients;
