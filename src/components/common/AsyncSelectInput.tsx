import React from "react";
import ReactSelectAsync from "react-select/async";

type Props = {
  value: string;
  label?: string;
  className?: string;
  onChange: any;
  error?: string;
  touched?: boolean;
  loadOptions: (input: string) => Promise<any>;
};

const AsyncSelectInput = ({ label, error, touched, ...selectInput }: Props) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label>{label}</label>
      <ReactSelectAsync defaultOptions isClearable {...selectInput} />
      {touched && error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export default AsyncSelectInput;
