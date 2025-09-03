import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";

const initPayment = catchAsync(async(req: Request, res: Response) => {
    const bookingId = req.params.bookingId


    const result = await PaymentServices.initPayment(bookingId as string)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully.",
        data: result
    })
})

const successPayment = catchAsync(async(req: Request, res: Response) => {
    const result = await PaymentServices.successPayment(req.query as Record<string, string>)

    if(result?.success){
        res.redirect(`envVars.SSL.SSL_SUCCESS_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result.message}&amount=${req.query.amount}&status=success`)
    }
})

const failPayment = catchAsync(async(req: Request, res: Response) => {
    const result = await PaymentServices.failPayment(req.query as Record<string, string>)

    if(!result?.success){
        res.redirect(`envVars.SSL.SSL_FAIL_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result?.message}&amount=${req.query.amount}&status=success`)
    }
})

const cancelPayment = catchAsync(async(req: Request, res: Response) => {
    const result = await PaymentServices.cancelPayment(req.query as Record<string, string>)

    if(!result?.success){
        res.redirect(`envVars.SSL.SSL_CANCEL_FRONTEND_URL?transactionId=${req.query.transaction}&message=${result?.message}&amount=${req.query.amount}&status=success`)
    }
})

export const PaymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
}