import { useEffect, useState } from "react";
import { FormikConfig, FormikValues } from "formik";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Supplier } from "@/utils/database/types";
import { SupplierRepo } from "@/utils/database/SupplierRepo";
import useFormikForm from "@/utils/hooks/useFormikForm";

type Option = {
  value: string;
  label: string;
};

type Props = FormikConfig<FormikValues> & {
  initialSelectValue: Option;
};

const useCreateProduct = ({ initialSelectValue, ...formikConfig }: Props) => {
  const [selectValue, setSelectValue] = useState<Option>(initialSelectValue);

  const supplier = new SupplierRepo(createSupabaseClient());

  const formik = useFormikForm(formikConfig);

  const { errors, touched, setFieldValue } = formik;

  const loadOptions = async (input: string) => {
    try {
      const suppliers = await supplier.getWithName(input);

      return suppliers.map(({ id, name }: Supplier) => ({
        value: id,
        label: name,
      }));
    } catch (error) {
      return [];
    }
  };

  const selectOptions = {
    loadOptions,
    label: "Supplier",
    value: selectValue as any,
    error: errors["supplier_id"] as string,
    touched: touched["supplier_id"] as boolean,
    onChange(newValue: Option) {
      setFieldValue("supplier_id", newValue.value);
      setSelectValue(newValue);
    },
  };

  useEffect(() => {
    setSelectValue(initialSelectValue);
  }, [initialSelectValue]);

  return {
    selectOptions,
    ...formik,
  };
};

export default useCreateProduct;
