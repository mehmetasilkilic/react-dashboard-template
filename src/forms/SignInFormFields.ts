import { z } from "zod";

export const SignInFormFields = [
  {
    name: "email",
    label: "Email",
    type: "text" as const,
    placeholder: "Enter your username",
    validation: z.string().min(2, "Username must be at least 4 characters"),
  },
  {
    name: "password",
    label: "Password",
    type: "password" as const,
    placeholder: "Enter your password",
    validation: z.string().min(6, "Password must be at least 6 characters"),
  },
];
