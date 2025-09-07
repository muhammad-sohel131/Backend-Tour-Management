import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Tour } from "../tour/tour.model";
import { Payment } from "../payment/payment.model";
import { sslService } from "../sslCommerz/sslCommerz.service";import { IsslCommerz } from "../sslCommerz/sslCommerz.interface";
import { getTransactionId } from "../../utils/getTransactionId";
;


const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update your profile to book a tour."
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "Not Tour Cost Found.");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount);

    const booking = await Booking.create(
      [
        {
          ...payload,
          user: userId,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          amount: amount,
          transactionId: transactionId,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      {
        payment: payment[0]._id,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");
     
    
    const sslPayload: IsslCommerz = {
      address: user.address,
      phoneNumber: user.phone,
      amount: amount,
      name: user.name,
      email: user.email,
      transaction: transactionId
    }
    const sslPayment = await sslService.sslPaymentInit(sslPayload)

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking
    };
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getAllBookings = async () => {
  return 0;
};

const getSingleBooking = async () => {
  return 0;
};

const getUserBookings = async () => {
  return 0;
};

const updateBookingStatus = async () => {
  return 0;
};
export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
  updateBookingStatus,
};
