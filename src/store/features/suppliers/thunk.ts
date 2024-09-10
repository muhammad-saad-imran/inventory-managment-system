import { createAsyncThunk } from "@reduxjs/toolkit";
import { completeLoading, startLoading } from "@/store/features/loading";
import { createSupabaseClient } from "@/utils/supabase/client";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import { Supplier } from "@/utils/database/types";

const FETCH_ALL_SUPPLIERS = "supplier/getAll";
const FETCH_SUPPLIER_BY_ID = "supplier/get";
const CREATE_SUPPLIER = "supplier/create";
const UPDATE_SUPPLIER = "supplier/update";
const DELETE_SUPPLIER = "supplier/delete";

const supplier = new SupplierRepo(createSupabaseClient());

export const getAllSupplier = createAsyncThunk(
  FETCH_ALL_SUPPLIERS,
  async (supplierName: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const supplierData = await supplier.getWithName(supplierName);
      dispatch(completeLoading());
      return supplierData;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while fetching suppliers");
      rejectWithValue(error);
    }
  }
);

export const getSupplier = createAsyncThunk(
  FETCH_SUPPLIER_BY_ID,
  async (supplierId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const allSupplierData = await supplier.get(supplierId);
      dispatch(completeLoading());
      return allSupplierData;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while fetching supplier");
      rejectWithValue(error);
    }
  }
);

export const createSupplier = createAsyncThunk(
  CREATE_SUPPLIER,
  async (newSupplier: Supplier, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const supplierData = await supplier.create(newSupplier);
      dispatch(completeLoading());
      return supplierData;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while creating supplier");
      rejectWithValue(error);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  UPDATE_SUPPLIER,
  async (supplierValues: Supplier, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      const supplierData = await supplier.update(
        supplierValues.id,
        supplierValues
      );
      dispatch(completeLoading());
      return supplierData;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while updating supplier");
      rejectWithValue(error);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  DELETE_SUPPLIER,
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(startLoading());
      await supplier.delete(id);
      dispatch(completeLoading());
      return;
    } catch (error) {
      dispatch(completeLoading());
      alert("Error while deleting supplier");
      rejectWithValue(error);
    }
  }
);
