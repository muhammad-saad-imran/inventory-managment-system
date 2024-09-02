import React from "react";
import { GroupBase, OptionsOrGroups } from "react-select";
import ReactSelectAsync from "react-select/async";

type Props = {
  value: string;
  label: string;
  onChange: any;
  error?: string;
  touched?: boolean;
  loadOptions: (input: string) => Promise<any>;
};

const SelectInput = ({ label, error, touched, ...selectInput }: Props) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label>{label}</label>
      <ReactSelectAsync cacheOptions defaultOptions {...selectInput} />
      {touched && error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export default SelectInput;
