import { useEffect, useState } from "react";
import { FormikConfig, FormikValues } from "formik";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { createSupabaseClient } from "@/utils/supabase/client";
import { ProductRepo } from "@/utils/database/ProductRepo";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import { Product, Supplier } from "@/utils/database/types";

type Props = FormikConfig<FormikValues> & {
  initialSelectedProduct?: Product & { label: string };
  initialSelectedSupplier?: Supplier & { label: string };
};

const supplier = new SupplierRepo(createSupabaseClient());
const product = new ProductRepo(createSupabaseClient());

const loadSuppliers = async (input: string) => {
  try {
    const supplierData = await supplier.getWithName(input);

    return supplierData.map((item) => ({
      label: item.name,
      value: item.id,
      ...item,
    }));
  } catch (error) {
    return [];
  }
};

const loadProducts = async (input: string) => {
  try {
    const productData = await product.getWithName(input);

    return productData.map((item) => ({
      label: item.name,
      value: item.id,
      ...item,
    }));
  } catch (error) {
    return [];
  }
};

const useInventoryForm = ({
  initialSelectedProduct,
  initialSelectedSupplier,
  ...formikConfig
}: Props) => {
  const [selectedProduct, setSelectedProduct] = useState(
    initialSelectedProduct
  );
  const [selectedSupplier, setSelectedSupplier] = useState(
    initialSelectedSupplier
  );

  const formik = useFormikForm(formikConfig);

  const { errors, touched, setFieldValue } = formik;

  const selectProductAttrs = {
    label: "Product",
    value: selectedProduct as any,
    error: errors.product_id as string,
    touched: touched.product_id as boolean,
    loadOptions: loadProducts,
    onChange(newOption: any) {
      setSelectedProduct(newOption);
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
      setSelectedSupplier(newOption);
      setFieldValue("supplier_id", newOption.id);
    },
  };

  useEffect(() => {
    setSelectedProduct(initialSelectedProduct);
  }, [initialSelectedProduct]);

  useEffect(() => {
    setSelectedSupplier(initialSelectedSupplier);
  }, [initialSelectedSupplier]);

  return {
    ...formik,
    selectProductAttrs,
    selectSupplierAttrs,
  };
};

export default useInventoryForm;
