import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { Supplier } from "@/utils/database/types";
import {
  getAllSupplier,
  getSupplier,
  updateSupplier,
} from "@/store/features/suppliers/thunk";

interface SupplierState {
  supplier: Supplier;
  allSuppliers: Supplier[];
}

const initialState = {
  supplier: {
    id: "",
    name: "",
    email: "",
    phone_number: 0,
    created_at: "",
  },
  allSuppliers: [],
} satisfies SupplierState as SupplierState;

const SupplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    setSupplier(state, action: PayloadAction<Supplier>) {
      return {
        ...state,
        supplier: {
          ...action.payload,
        },
      };
    },
    setAllSuppliers(state, action: PayloadAction<Supplier[]>) {
      return {
        ...state,
        allSuppliers: [...action.payload],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSupplier.fulfilled, (state, action) => {
        if (action.payload) {
          state.allSuppliers = action.payload;
        }
      })
      .addCase(getSupplier.fulfilled, (state, action) => {
        if (action.payload) {
          state.supplier = action.payload;
        }
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        if (action.payload) {
          state.supplier = action.payload;
        }
      });
  },
});

export const { setAllSuppliers, setSupplier } = SupplierSlice.actions;
export default SupplierSlice.reducer;

export const selectSupplier = (state: RootState) => state.supplier.supplier;
export const selectAllSuppliers = (state: RootState) =>
  state.supplier.allSuppliers;
