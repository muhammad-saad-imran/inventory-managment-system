"use client";

import { useSearchParams } from "next/navigation";
import { login } from "@/utils/actions/login.actions";

const INVALID_CREDENTIALS = "Invalid login credentials";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error");
  let error;

  if (errorMessage && errorMessage === INVALID_CREDENTIALS) {
    error = "Wrong credentials used";
  } else if (errorMessage) {
    error = "Something went wrong";
  }

  return (
    <form action={login} method="POST">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      {error && <p className="text-sm">{error}</p>}
      <button>Log in</button>
    </form>
  );
}
