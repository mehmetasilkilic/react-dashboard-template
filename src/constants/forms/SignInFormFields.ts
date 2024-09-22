import { z } from "zod";

export const SignInFormFields = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email({
      message: "Invalid email address.",
    })
    .max(255, {
      message: "Email must not exceed 255 characters.",
    }),

  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .max(32, {
      message: "Password must not exceed 32 characters.",
    }),

  rememberMe: z
    .boolean()
    .describe("Remember me")
    .refine((value) => value, {
      message: "You must accept the terms and conditions.",
      path: ["rememberMe"],
    })
    .optional(),
});
