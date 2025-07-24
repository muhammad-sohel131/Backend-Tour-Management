import z from "zod";
export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division Name should be a string" })
    .min(2, { message: "Division Name Length should be at least 2 characters" })
    .max(50, {
      message: "Division Name Length should be less than 50 characters",
    }),

  thumbnail: z
    .string({ invalid_type_error: "Thumbnail should be string" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description should be string" })
    .optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division Name should be a string" })
    .min(2, { message: "Division Name Length should be at least 2 characters" })
    .max(50, {
      message: "Division Name Length should be less than 50 characters",
    }),

  thumbnail: z
    .string({ invalid_type_error: "Thumbnail should be string" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description should be string" })
    .optional(),
});
