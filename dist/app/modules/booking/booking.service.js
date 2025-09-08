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
exports.BookingService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const tour_model_1 = require("../tour/tour.model");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const getTransactionId_1 = require("../../utils/getTransactionId");
;
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = (0, getTransactionId_1.getTransactionId)();
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !user.address) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please update your profile to book a tour.");
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!(tour === null || tour === void 0 ? void 0 : tour.costFrom)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Not Tour Cost Found.");
        }
        const amount = Number(tour.costFrom) * Number(payload.guestCount);
        const booking = yield booking_model_1.Booking.create([
            Object.assign(Object.assign({}, payload), { user: userId }),
        ], { session });
        const payment = yield payment_model_1.Payment.create([
            {
                booking: booking[0]._id,
                amount: amount,
                transactionId: transactionId,
            },
        ], { session });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking[0]._id, {
            payment: payment[0]._id,
        }, {
            new: true,
            runValidators: true,
            session,
        })
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");
        const sslPayload = {
            address: user.address,
            phoneNumber: user.phone,
            amount: amount,
            name: user.name,
            email: user.email,
            transaction: transactionId
        };
        const sslPayment = yield sslCommerz_service_1.sslService.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking
        };
    }
    catch (err) {
        console.log(err);
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return 0;
});
const getSingleBooking = () => __awaiter(void 0, void 0, void 0, function* () {
    return 0;
});
const getUserBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return 0;
});
const updateBookingStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return 0;
});
exports.BookingService = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getUserBookings,
    updateBookingStatus,
};
