"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.divisionService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload;
    const isNameExist = yield division_model_1.Division.findOne({ name });
    if (isNameExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Use Unique Name");
    }
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const getAllDivision = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield division_model_1.Division.find();
    const total = yield division_model_1.Division.countDocuments();
    return {
        data,
        meta: {
            total,
        },
    };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield division_model_1.Division.findOne({ slug });
    return data;
});
const updateDivision = (divisionId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield division_model_1.Division.findById(divisionId);
    if (!isDivisionExist) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Division is not found");
    }
    const isNameExist = yield division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: divisionId },
    });
    if (isNameExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Division Name is Already Exist");
    }
    const updatedDivision = yield division_model_1.Division.findByIdAndUpdate(divisionId, payload, { new: true, runValidators: true });
    return updatedDivision;
});
const deleteDivision = (divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    // handle case where division is associated with tour
    const deletedDivision = yield division_model_1.Division.findByIdAndDelete(divisionId);
    return deletedDivision;
});
exports.divisionService = {
    getAllDivision,
    createDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision
};
