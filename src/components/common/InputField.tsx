import React, { InputHTMLAttributes } from "react";
import { Input } from "@/elements/inputs/Input";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  touched?: boolean;
};

const InputField = ({ label, error, touched, ...inputProps }: Props) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={inputProps.id}>{label}</label>
      <Input {...inputProps} />
      {touched && error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export default InputField;
