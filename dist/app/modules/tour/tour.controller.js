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
exports.tourControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const tour_service_1 = require("./tour.service");
const getAllTourTypes = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypes = yield tour_service_1.tourServices.getAllTourTypes();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Tour Types are fetched",
        data: tourTypes,
    });
}));
const createTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createdTourType = yield tour_service_1.tourServices.createTourType(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Tour Type is created.",
        data: createdTourType,
    });
}));
const updateTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypeId = req.params.id;
    const updatedTourType = yield tour_service_1.tourServices.updateTourType(tourTypeId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "TourType is updated Successfully.",
        success: true,
        data: updatedTourType,
    });
}));
const deleteTourType = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourTypeId = req.params.id;
    const deletedTourType = yield tour_service_1.tourServices.deleteTourType(tourTypeId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "TourType is Deleted",
        success: true,
        data: deletedTourType,
    });
}));
// Tour Controllers -----------------------------------
const createTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourPayload = Object.assign(Object.assign({}, req.body), { images: req.files.map(file => file.path) });
    const createdTour = yield tour_service_1.tourServices.createTour(tourPayload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Tour is created.",
        data: createdTour,
    });
}));
const getAllTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tours = yield tour_service_1.tourServices.getAllTour(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Tours are fetched.",
        data: tours.data,
        meta: tours.meta,
    });
}));
const updateTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = req.params.id;
    const updatedTour = yield tour_service_1.tourServices.updateTour(tourId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Tour is Updated Successfully.",
        statusCode: http_status_codes_1.default.OK,
        data: updatedTour,
    });
}));
const deleteTour = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedTour = yield tour_service_1.tourServices.deleteTour(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The tour is Deleted Successfully.",
        data: deletedTour,
    });
}));
exports.tourControllers = {
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType,
    getAllTour,
    createTour,
    updateTour,
    deleteTour,
};
