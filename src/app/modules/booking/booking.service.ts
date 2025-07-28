import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import { IBooking } from "./booking.interface"
import httpStatus from 'http-status-codes'
import { Booking } from "./booking.model"
import { Tour } from "../tour/tour.model"
import { Payment } from "../payment/payment.model"

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}
const createBooking = async(payload: Partial<IBooking>, userId: string) => {
    const user = await User.findById(userId)
    const transactionId = getTransactionId()

    if(!user?.phone || !user.address){
        throw new AppError(httpStatus.BAD_REQUEST, 'Please update your profile to book a tour.')
    }

    const tour = await Tour.findById(payload.tour).select('costFrom')

    if(!tour?.costFrom){
        throw new AppError(httpStatus.BAD_REQUEST, 'Not Tour Cost Found.')
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount)

    const booking = await Booking.create({
        ...payload,
        user: userId
    })

    const payment = await Payment.create({
        booking: booking._id,
        amount: amount,
        transactionId: transactionId
    })

    const updatedBooking = await Booking.findByIdAndUpdate(booking._id, {
        payment: payment._id
    }, {
        new: true,
        runValidators: true
    })
    .populate('user', "name email phone address")
    .populate('tour', 'title costFrom')
    .populate('payment')
    return updatedBooking
}

const getAllBookings = async() => {
    return 0
}

const getSingleBooking = async() => {
    return 0
}

const getUserBookings = async() => {
    return 0
}

const updateBookingStatus = async() => {
    return 0
}
export const BookingService = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getUserBookings,
    updateBookingStatus
}