"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTourTypeZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name Must be a String" })
        .min(2, { message: "Name length should be at least 2 characters" }),
});
