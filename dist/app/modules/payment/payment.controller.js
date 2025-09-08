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
exports.PaymentController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const payment_service_1 = require("./payment.service");
const sendResponse_1 = require("../../utils/sendResponse");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const initPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const result = yield payment_service_1.PaymentServices.initPayment(bookingId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully.",
        data: result,
    });
}));
const successPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.successPayment(req.query);
    console.log(result);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`envVars.SSL.SSL_SUCCESS_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result.message}&amount=${req.query.amount}&status=success`);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully.",
        data: result,
    });
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.failPayment(req.query);
    if (!(result === null || result === void 0 ? void 0 : result.success)) {
        res.redirect(`envVars.SSL.SSL_FAIL_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result === null || result === void 0 ? void 0 : result.message}&amount=${req.query.amount}&status=success`);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Payment Failed.",
        data: result,
    });
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.cancelPayment(req.query);
    if (!(result === null || result === void 0 ? void 0 : result.success)) {
        res.redirect(`envVars.SSL.SSL_CANCEL_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result === null || result === void 0 ? void 0 : result.message}&amount=${req.query.amount}&status=success`);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Payment Canceled.",
        data: result,
    });
}));
const getInvoice = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.params;
    const url = yield payment_service_1.PaymentServices.getInvoice(paymentId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Retrived the invoice download URL.",
        statusCode: 200,
        data: url,
    });
}));
const validatePayment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sslCommerz_service_1.sslService.validatePayment(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Payment Validated Successfully.",
        statusCode: 200,
        data: null,
    });
}));
exports.PaymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoice,
    validatePayment,
};
