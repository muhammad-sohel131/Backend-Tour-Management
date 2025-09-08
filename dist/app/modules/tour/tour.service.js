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
exports.tourServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_const_1 = require("./tour.const");
const tour_model_1 = require("./tour.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getAllTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypes = yield tour_model_1.TourType.find();
    return tourTypes;
});
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload;
    const isTourTypeExist = yield tour_model_1.TourType.findOne({ name });
    if (isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour Type is Already Exist");
    }
    const createdTourType = yield tour_model_1.TourType.create(payload);
    return createdTourType;
});
const updateTourType = (tourTypeId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload;
    const isTourTypeExist = yield tour_model_1.TourType.findById(tourTypeId);
    if (!isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "The Tour Type is not found!");
    }
    const isNameExist = yield tour_model_1.TourType.findOne({
        name,
        _id: { $ne: tourTypeId },
    });
    if (isNameExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The Name is Already Used.");
    }
    const updatedTourType = yield tour_model_1.TourType.findByIdAndUpdate(tourTypeId, payload, { new: true, runValidators: true });
    return updatedTourType;
});
const deleteTourType = (tourTypeId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedTourType = yield tour_model_1.TourType.findByIdAndDelete(tourTypeId);
    return deletedTourType;
});
// Tour Services----------------------------------
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createdTour = yield tour_model_1.Tour.create(payload);
    return createdTour;
});
// const getAllTour = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";
//   const page = Number(query.page) || 1
//   const limit = Number(query.limit) || 10
//   const skip = (page - 1) * limit
//   for (const field of excludedField) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }
//   const searchQuery = {
//     $or: tourSearchField.map((filed) => ({
//       [filed]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
//   const tours = await Tour.find(searchQuery)
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit)
//   const totalTours = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalTours / limit)
//   return {
//     data: tours,
//     meta: {
//       page: page,
//       limit: limit,
//       total: totalTours,
//       totalPage
//     },
//   };
// };
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const tourBuilders = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield tourBuilders
        .search(tour_const_1.tourSearchField)
        .filter()
        .sort()
        .fields()
        .paginate()
        .build();
    // const totalTours = await Tour.countDocuments();
    const meta = yield tourBuilders.getMeta();
    return {
        data: tours,
        meta,
    };
});
const updateTour = (tourId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findById(tourId);
    if (!isTourExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour is not found.");
    }
    if (payload.images &&
        payload.images.length &&
        isTourExist.images &&
        isTourExist.images.length) {
        payload.images = [...payload.images, ...isTourExist.images];
    }
    if (payload.deleteImages &&
        payload.deleteImages.length &&
        isTourExist.images &&
        isTourExist.images.length) {
        const restDBImages = isTourExist.images.filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = (payload.images || [])
            .filter((imageUrl) => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter((imageUrl) => !restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(tourId, payload, {
        new: true,
        runValidators: true,
    });
    if (payload.deleteImages &&
        payload.deleteImages.length &&
        isTourExist.images &&
        isTourExist.images.length) {
        yield Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourExist = yield tour_model_1.Tour.findById(tourId);
    if (!isTourExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Tour is not found.");
    }
    const deletedTour = yield tour_model_1.Tour.findByIdAndDelete(tourId);
    return deletedTour;
});
exports.tourServices = {
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType,
    getAllTour,
    createTour,
    updateTour,
    deleteTour,
};
