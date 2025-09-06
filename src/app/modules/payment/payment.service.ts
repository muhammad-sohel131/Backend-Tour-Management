import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { IsslCommerz } from "../sslCommerz/sslCommerz.interface";
import { User } from "../user/user.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { sslService } from "../sslCommerz/sslCommerz.service";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { IUser } from "../user/user.interface";
import { ITour } from "../tour/tour.interface";
import { sendEmail } from "../../utils/sendEmail";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(404, "Payment not found. you have not book this tour.");
  }

  const booking = await Booking.findById(payment.booking);
  const user = await User.findById(booking?.user);

  const sslCommerz: IsslCommerz = {
    address: user?.address as string,
    email: user?.email as string,
    amount: payment.amount,
    name: user?.name as string,
    phoneNumber: user?.phone as string,
    transaction: payment.transactionId,
  };

  const sslPayment = await sslService.sslPaymentInit(sslCommerz);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
    booking: booking,
  };
};
const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      {
        status: PAYMENT_STATUS.PAID,
      },
      {
        new: true,
        runValidators: true,
        session: session,
      }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    )
      .populate("tour", "title")
      .populate("user", "name", "email");

    const invoiceData: IInvoiceData = {
      username: (updatedBooking?.user as IUser).name,
      bookingDate: updatedBooking?.createdAt as Date,
      guestCount: updatedBooking?.guestCount as number,
      tourTitle: (updatedBooking?.tour as ITour).title,
      totalAmount: updatedPayment?.amount as number,
      transactionId: updatedPayment?.transactionId as string,
    };

    const pdfBuffer = await generatePdf(invoiceData)
    await sendEmail({
      to: (updatedBooking?.user as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    })
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment Completed Successful.",
    };
  } catch (error) {
    console.log(error);
    await session.commitTransaction();
    session.endSession();
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      {
        runValidators: true,
        session: session,
      }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.FAILED,
      },
      {
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment Failed.",
    };
  } catch (error) {
    console.log(error);
    await session.commitTransaction();
    session.endSession();
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query.transactionId,
      },
      {
        status: PAYMENT_STATUS.CANCELED,
      },
      {
        new: true,
        runValidators: true,
        session: session,
      }
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.CANCEL,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment Canceled.",
    };
  } catch (error) {
    console.log(error);
    await session.commitTransaction();
    session.endSession();
  }
};
export const PaymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
