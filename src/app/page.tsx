"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { createClient } from "@/utils/supabase/client";
import { loginSchema } from "@/validations/login.validation";
import { Button } from "@/elements/button/Button";
import { FlexContainer } from "@/elements/containers/FlexContainer";
import InputField from "@/components/common/InputField";

const INVALID_CREDENTIALS = "Invalid login credentials";

export default function LoginPage() {
  const router = useRouter();
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
      const supabase = createClient();
      const { error, data } = await supabase.auth.signInWithPassword(values);

      if (error?.message === INVALID_CREDENTIALS) {
        setFieldError("password", "Wrong credentials used");
      } else if (error) {
        setFieldError("password", "Something went wrong");
      }

      if (data.user) {
        router.push("dashboard");
      }

      setSubmitting(false);
    },
  });

  return (
    <FlexContainer>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col border w-96 p-8 rounded-lg gap-6 shadow-lg bg-white"
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
    </FlexContainer>
  );
}
