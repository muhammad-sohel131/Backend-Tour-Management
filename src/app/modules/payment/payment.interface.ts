import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = 'PAID',
    CANCELED = 'CANCEL',
    UNPAID = 'UNPAID',
    FAILED = 'FAILED',
    REFUND = 'REFUND'
}

export interface IPayment {
    booking: Types.ObjectId
    transactionId: string,
    amount: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentGatewaysData ?: any ,
    invoiceUrl ?: string,
    status: PAYMENT_STATUS
}