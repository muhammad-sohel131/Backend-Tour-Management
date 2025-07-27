import z from "zod";
export const createTourTypeZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name Must be a String" })
    .min(2, { message: "Name length should be at least 2 characters" }),
});
