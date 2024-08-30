"use client";

import { useFormik } from "formik";
import { login } from "@/utils/actions/auth.actions";
import { loginSchema } from "@/validations/login.validation";
import { Button } from "@/elements/button/Button";
import InputField from "@/components/common/InputField";

export default function LoginForm() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      const { error } = await login(values);
      setFieldError("password", error);
      setSubmitting(false);
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      method="POST"
      className="flex flex-col justify-center w-96 p-8 gap-6"
    >
      <InputField
        id="email"
        label="Email:"
        name="email"
        type="email"
        value={values.email}
        error={errors.email}
        touched={touched.email}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />
      <InputField
        id="password"
        label="Password:"
        name="password"
        type="password"
        value={values.password}
        error={errors.password}
        touched={touched.password}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      />
      <Button type="submit" className="ml-auto" disabled={isSubmitting}>
        Log in
      </Button>
    </form>
  );
}
