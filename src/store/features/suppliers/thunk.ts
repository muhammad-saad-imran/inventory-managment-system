import { createSupabaseClient } from "@/utils/supabase/client";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import { Supplier } from "@/utils/database/types";
import { customThunkCreator } from "@/store/utils";

const FETCH_ALL_SUPPLIERS = "supplier/getAll";
const FETCH_SUPPLIER_BY_ID = "supplier/get";
const CREATE_SUPPLIER = "supplier/create";
const UPDATE_SUPPLIER = "supplier/update";
const DELETE_SUPPLIER = "supplier/delete";

const supplier = new SupplierRepo(createSupabaseClient());

/**
 * Async thunk for Supplier CRUD,
 * `getAllSupplier`, `getSupplier` & `updateSupplier` update redux state after they are fulfilled
 */

export const getAllSupplier = customThunkCreator<string, Supplier[]>(
  FETCH_ALL_SUPPLIERS,
  "Error ocuured fetching suppliers",
  async (supplierName: string) => {
    const supplierData = await supplier.getWithName(supplierName);
    return supplierData;
  }
);

export const getSupplier = customThunkCreator<string, Supplier>(
  FETCH_SUPPLIER_BY_ID,
  "Error ocuured fetching suppliers",
  async (supplierId: string) => {
    const allSupplierData = await supplier.get(supplierId);
    return allSupplierData;
  }
);

export const createSupplier = customThunkCreator<Supplier, Supplier>(
  CREATE_SUPPLIER,
  "Error ocuured creating suppliers",
  async (newSupplier: Supplier) => {
    const supplierData = await supplier.create(newSupplier);
    return supplierData;
  }
);

export const updateSupplier = customThunkCreator<Supplier, Supplier>(
  UPDATE_SUPPLIER,
  "Error ocuured updating suppliers",
  async (supplierValues: Supplier) => {
    const supplierData = await supplier.update(
      supplierValues.id,
      supplierValues
    );
    return supplierData;
  }
);

export const deleteSupplier = customThunkCreator<string, void>(
  DELETE_SUPPLIER,
  "Error ocuured deleting suppliers",
  async (id: string) => {
    await supplier.delete(id);
  }
);
