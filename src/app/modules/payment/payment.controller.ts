import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import { sslService } from "../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;

  const result = await PaymentServices.initPayment(bookingId as string);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment done successfully.",
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.successPayment(
    req.query as Record<string, string>
  );

  console.log(result);
  if (result?.success) {
    res.redirect(
      `envVars.SSL.SSL_SUCCESS_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result.message}&amount=${req.query.amount}&status=success`
    );
  }

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment done successfully.",
    data: result,
  });
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.failPayment(
    req.query as Record<string, string>
  );

  if (!result?.success) {
    res.redirect(
      `envVars.SSL.SSL_FAIL_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result?.message}&amount=${req.query.amount}&status=success`
    );
  }

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment Failed.",
    data: result,
  });
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.cancelPayment(
    req.query as Record<string, string>
  );

  if (!result?.success) {
    res.redirect(
      `envVars.SSL.SSL_CANCEL_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result?.message}&amount=${req.query.amount}&status=success`
    );
  }

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment Canceled.",
    data: result,
  });
});

const getInvoice = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;

  const url = await PaymentServices.getInvoice(paymentId);
  sendResponse(res, {
    success: true,
    message: "Retrived the invoice download URL.",
    statusCode: 200,
    data: url,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await sslService.validatePayment(req.body);
  sendResponse(res, {
    success: true,
    message: "Payment Validated Successfully.",
    statusCode: 200,
    data: null,
  });
});
export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoice,
  validatePayment,
};
