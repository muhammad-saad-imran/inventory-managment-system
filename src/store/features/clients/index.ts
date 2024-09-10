import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Client } from "@/utils/database/types";

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
  reducers: {
    setClient(state, action: PayloadAction<Client>) {
      return {
        ...state,
        supplier: {
          ...action.payload,
        },
      };
    },
    setAllClients(state, action: PayloadAction<Client[]>) {
      return {
        ...state,
        allSuppliers: [...action.payload],
      };
    },
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(getAllProducts.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.allProducts = action.payload;
    //     }
    //   })
    //   .addCase(getProduct.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.product = action.payload;
    //     }
    //   })
    //   .addCase(updateProduct.fulfilled, (state, action) => {
    //     if (action.payload) {
    //       state.product = action.payload;
    //     }
    //   });
  },
});

export const { setAllClients, setClient } = ClientSlice.actions;
export default ClientSlice.reducer;

export const selectClient = (state: RootState) => state.client.client;
export const selectAllClients = (state: RootState) => state.client.allClients;
