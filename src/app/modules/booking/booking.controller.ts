/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body, decodedToken.userId);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  }
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await BookingService.getAllBookings();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  }
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.getSingleBooking();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  }
);

const getUserBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await BookingService.getUserBookings();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  }
);
const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.updateBookingStatus();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking status is updated successfully",
      data: booking,
    });
  }
);
export const BookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getUserBookings,
  updateBookingStatus,
};
