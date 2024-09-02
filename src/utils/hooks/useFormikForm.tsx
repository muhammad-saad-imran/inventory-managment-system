import React from "react";
import { FormikConfig, FormikValues, useFormik } from "formik";

type Props = {};

const useFormikForm = (formikConfig: FormikConfig<FormikValues>) => {
  const formik = useFormik(formikConfig);

  const getFieldAttrs = (label: string, fieldName: keyof FormikValues) => ({
    label,
    id: fieldName as string,
    name: fieldName as string,
    value: formik.values[fieldName],
    error: formik.errors[fieldName] as string,
    touched: formik.touched[fieldName] as boolean,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
  });
  return { ...formik, getFieldAttrs };
};

export default useFormikForm;
