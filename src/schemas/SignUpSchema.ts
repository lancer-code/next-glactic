import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Enter 4 Character Username Mnimum")
  .max(10, "Enter 10 Character Username Maximum")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contains Special Characters");


export const SignUpSchema = z.object({
    username : usernameValidation,
    email: z.string().email({message: "Enter a Valid Email"}),
    password: z.string().min(4, "Password Must be 4 Characters Long")
})
