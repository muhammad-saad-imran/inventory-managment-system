import "@testing-library/jest-dom";
import { loadEnvConfig } from "@next/env";
import { resolve } from "path";
import { TextEncoder } from "util";

export default async () => {
  global.TextEncoder = TextEncoder;
  const envFile = resolve(__dirname, ".");
  loadEnvConfig(envFile);
};
