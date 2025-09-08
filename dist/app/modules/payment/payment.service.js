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
exports.PaymentServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const user_model_1 = require("../user/user.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(404, "Payment not found. you have not book this tour.");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking);
    const user = yield user_model_1.User.findById(booking === null || booking === void 0 ? void 0 : booking.user);
    const sslCommerz = {
        address: user === null || user === void 0 ? void 0 : user.address,
        email: user === null || user === void 0 ? void 0 : user.email,
        amount: payment.amount,
        name: user === null || user === void 0 ? void 0 : user.name,
        phoneNumber: user === null || user === void 0 ? void 0 : user.phone,
        transaction: payment.transactionId,
    };
    const sslPayment = yield sslCommerz_service_1.sslService.sslPaymentInit(sslCommerz);
    return {
        paymentUrl: sslPayment.GatewayPageURL,
        booking: booking,
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({
            transactionId: query.transactionId,
        }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID,
        }, {
            new: true,
            runValidators: true,
            session: session,
        });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.COMPLETE,
        }, {
            new: true,
            runValidators: true,
            session,
        })
            .populate("tour", "title")
            .populate("user", "name email");
        const invoiceData = {
            userName: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name,
            bookingDate: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.createdAt,
            guestCount: updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.guestCount,
            tourTitle: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.tour).title,
            totalAmount: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.amount,
            transactionId: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.transactionId,
        };
        const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
        const cloudinaryResult = (yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice"));
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment._id, {
            invoiceUrl: cloudinaryResult.secure_url,
        }, {
            runValidators: true, session
        });
        yield (0, sendEmail_1.sendEmail)({
            to: (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Completed Successful.",
        };
    }
    catch (error) {
        console.log(error);
        yield session.commitTransaction();
        session.endSession();
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({
            transactionId: query.transactionId,
        }, {
            status: payment_interface_1.PAYMENT_STATUS.FAILED,
        }, {
            runValidators: true,
            session: session,
        });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.FAILED,
        }, {
            runValidators: true,
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment Failed.",
        };
    }
    catch (error) {
        console.log(error);
        yield session.commitTransaction();
        session.endSession();
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({
            transactionId: query.transactionId,
        }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELED,
        }, {
            new: true,
            runValidators: true,
            session: session,
        });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, {
            status: booking_interface_1.BOOKING_STATUS.CANCEL,
        }, {
            new: true,
            runValidators: true,
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Canceled.",
        };
    }
    catch (error) {
        console.log(error);
        yield session.commitTransaction();
        session.endSession();
        throw new AppError_1.default(401, "Something wrong to make cancel");
    }
});
const getInvoice = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId).select("invoiceUrl").orFail(new Error("Payment not found."));
    if (!payment.invoiceUrl) {
        throw new AppError_1.default(401, "Invoice not available yet.");
    }
    return payment.invoiceUrl;
});
exports.PaymentServices = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoice
};
