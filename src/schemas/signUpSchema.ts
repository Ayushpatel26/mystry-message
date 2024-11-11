import { z } from 'zod';

export const usernameValidation = z.string().min(3, "username must be of atleast 3 characters").max(15, "Username must be no more than 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username is invalid (must not contain special characters)")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
});