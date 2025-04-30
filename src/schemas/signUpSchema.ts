import { z } from "zod";
console.log("I am in zod")

export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');


export const emailValidation = z.string().email({ message: "Invalid email address" })

export const signUpSchema = z.object({

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
}
);
