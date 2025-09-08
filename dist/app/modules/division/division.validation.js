"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Division Name should be a string" })
        .min(2, { message: "Division Name Length should be at least 2 characters" })
        .max(50, {
        message: "Division Name Length should be less than 50 characters",
    }),
    thumbnail: zod_1.default
        .string({ invalid_type_error: "Thumbnail should be string" })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description should be string" })
        .optional(),
});
exports.updateDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Division Name should be a string" })
        .min(2, { message: "Division Name Length should be at least 2 characters" })
        .max(50, {
        message: "Division Name Length should be less than 50 characters",
    }),
    thumbnail: zod_1.default
        .string({ invalid_type_error: "Thumbnail should be string" })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description should be string" })
        .optional(),
});
