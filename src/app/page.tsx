"use client";

import Image from "next/image";
import { useFormik } from "formik";
import { useAppDispatch } from "@/store/hooks";
import { completeLoading, startLoading } from "@/store/LoadingSlice";
import { login } from "@/utils/actions/auth.actions";
import { loginSchema } from "@/utils/validations/auth.validation";
import { FlexContainer } from "@/elements/containers";
import { Button } from "@/elements/buttons";
import InputField from "@/components/common/InputField";

export default function LoginPage() {
  const dispatch = useAppDispatch();
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
      dispatch(startLoading());
      /* On sucess login will redirect to dashboard */
      const { error } = await login(values);
      setFieldError("password", error);
      setSubmitting(false);
      dispatch(completeLoading());
    },
  });

  return (
    <FlexContainer>
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
