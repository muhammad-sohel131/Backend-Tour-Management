import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { tourServices } from "./tour.service"
import { ITour, ITourType } from "./tour.interface"

const getAllTourTypes = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await tourServices.getAllTourTypes()

    sendResponse<ITourType[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Tour Types are fetched",
        data: tourTypes
    })
})

const createTourType = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const createdTourType = await tourServices.createTourType(req.body)
    
    sendResponse<ITourType>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Tour Type is created.',
        data: createdTourType
    })
})

const updateTourType = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id
    const updatedTourType = await tourServices.updateTourType(tourTypeId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "TourType is updated Successfully.",
        success: true,
        data: updatedTourType
    })
})

const deleteTourType = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    const deletedTourType = await tourServices.deleteTourType(tourTypeId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "TourType is Deleted",
        success: true,
        data: deletedTourType
    })
})

// Tour Controllers -----------------------------------
const createTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const createdTour = await tourServices.createTour(req.body)

    sendResponse<ITour>(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour is created.",
        data: createdTour
    })
})

const getAllTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const tours = await tourServices.getAllTour()

    sendResponse<ITour[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Tours are fetched.",
        data: tours.data,
        meta: tours.meta
    })
})

const updateTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const tourId = req.params.id
    const updatedTour = await tourServices.updateTour(tourId, req.body)

    sendResponse(res, {
        success: true,
        message: "Tour is Updated Successfully.",
        statusCode: httpStatus.OK,
        data: updatedTour,
    })
})

const deleteTour = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const deletedTour = await tourServices.deleteTour(req.params.id)

    sendResponse<ITour>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "The tour is Deleted Successfully.",
        data: deletedTour
    })
})
export const tourControllers = {
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType,
    getAllTour,
    createTour,
    updateTour,
    deleteTour
}