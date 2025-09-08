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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = exports.TourType = void 0;
const mongoose_1 = require("mongoose");
const tourTypeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true,
});
exports.TourType = (0, mongoose_1.model)("TourType", tourTypeSchema);
const tourSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
    },
    costFrom: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    arrivalLocation: {
        type: String,
    },
    departureLocation: {
        type: String,
    },
    included: {
        type: [String],
        default: [],
    },
    excluded: {
        type: [String],
        default: [],
    },
    amenities: {
        type: [String],
        default: [],
    },
    tourPlane: {
        type: [String],
        default: [],
    },
    maxGuest: {
        type: Number,
    },
    minAge: {
        type: Number,
    },
    division: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Division",
        required: true,
    },
    tourType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TourType",
        required: true,
    },
}, {
    timestamps: true,
});
tourSchema.pre("save", function (next) {
    var _a;
    if (this.isModified("title")) {
        const baseSlug = (_a = this.title) === null || _a === void 0 ? void 0 : _a.split(" ").join("-").toLowerCase();
        this.slug = baseSlug;
    }
    next();
});
tourSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const tour = this.getUpdate();
        if (tour.title) {
            const baseSlug = (_a = tour.title) === null || _a === void 0 ? void 0 : _a.split(" ").join("-").toLowerCase();
            tour.slug = baseSlug;
        }
        this.setUpdate(tour);
        next();
    });
});
exports.Tour = (0, mongoose_1.model)("Tour", tourSchema);
