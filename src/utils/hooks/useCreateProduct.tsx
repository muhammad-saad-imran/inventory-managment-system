import { useEffect, useState } from "react";
import { FormikConfig, FormikValues } from "formik";
import { createSupabaseClient } from "@/utils/supabase/client";
import { Product, Supplier } from "@/utils/supabase/types";
import useFormikForm from "@/utils/hooks/useFormikForm";
import { createProduct } from "@/utils/actions/product.actions";
import { productSchema } from "@/utils/validations/product.validation";

type Option = {
  value: string;
  label: string;
};

type Props = FormikConfig<FormikValues> & {
  initialSelectValue: Option;
};

const useCreateProduct = ({ initialSelectValue, ...formikConfig }: Props) => {
  const [selectValue, setSelectValue] = useState<Option>(initialSelectValue);

  const formik = useFormikForm(formikConfig);

  const { errors, touched, setFieldValue } = formik;

  const loadOptions = async (input: string) => {
    const supabase = createSupabaseClient();
    const { data: suppliers } = await supabase
      .from("suppliers")
      .select()
      .ilike("name", `%${input}%`);

    return suppliers
      ? suppliers.map(({ id, name }: Supplier) => ({
          value: id,
          label: name,
        }))
      : [];
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
