"use client";

import { useRef } from "react";
import Image from "next/image";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useFormik } from "formik";
import { login } from "@/utils/actions/auth.actions";
import { loginSchema } from "@/utils/validations/auth.validation";
import { FlexContainer } from "@/elements/containers";
import { Button } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

export default function LoginPage() {
  const loadingRef = useRef<LoadingBarRef>(null);
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
      /* On sucess login will redirect to dashboard */
      loadingRef.current?.continuousStart();
      const { error } = await login(values);
      setFieldError("password", error);
      setSubmitting(false);
      loadingRef.current?.complete();
    },
  });

  return (
    <FlexContainer>
      <LoadingBar ref={loadingRef} />
      <div className="flex p-5 bg-white rounded-lg shadow-lg">
        <Image
          className="pr-8"
          src="/login.jpg"
          alt=""
          width={500}
          height={500}
        />
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
      </div>
    </FlexContainer>
  );
}
