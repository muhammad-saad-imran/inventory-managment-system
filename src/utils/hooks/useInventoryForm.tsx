import { FormikConfig, FormikValues } from "formik";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectSelectedProduct,
  selectSelectedSupplier,
  setSelectedProduct,
  setSelectedSupplier,
} from "@/store/features/inventory";
import { getAllProducts } from "@/store/features/products/thunk";
import { getAllSupplier } from "@/store/features/suppliers/thunk";

const useInventoryForm = (formikConfig: FormikConfig<FormikValues>) => {
  const dispatch = useAppDispatch();

  const selectedProduct = useAppSelector(selectSelectedProduct);
  const selectedSupplier = useAppSelector(selectSelectedSupplier);

  const formik = useFormikForm(formikConfig);

  const { errors, touched, setFieldValue } = formik;

  const loadProducts = async (input: string) => {
    try {
      const productData = await dispatch(getAllProducts(input)).unwrap();

      return productData
        ? productData.map((item) => ({
            label: item.name,
            value: item.id,
            ...item,
          }))
        : [];
    } catch (error) {
      return [];
    }
  };

  const loadSuppliers = async (input: string) => {
    try {
      const supplierData = await dispatch(getAllSupplier(input)).unwrap();

      return supplierData
        ? supplierData.map((item) => ({
            label: item.name,
            value: item.id,
            ...item,
          }))
        : [];
    } catch (error) {
      return [];
    }
  };

  const selectProductAttrs = {
    label: "Product",
    value: selectedProduct as any,
    error: errors.product_id as string,
    touched: touched.product_id as boolean,
    loadOptions: loadProducts,
    onChange(newOption: any) {
      dispatch(setSelectedProduct(newOption));
      setFieldValue("product_id", newOption.id);
    },
  };

  const selectSupplierAttrs = {
    label: "Supplier",
    value: selectedSupplier as any,
    error: errors.supplier_id as string,
    touched: touched.supplier_id as boolean,
    loadOptions: loadSuppliers,
    onChange(newOption: any) {
      dispatch(setSelectedSupplier(newOption));
      setFieldValue("supplier_id", newOption.id);
    },
  };

  return {
    ...formik,
    selectProductAttrs,
    selectSupplierAttrs,
  };
};

export default useInventoryForm;
