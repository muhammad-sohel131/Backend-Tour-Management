import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { tourServices } from "./tour.service"
import { ITourType } from "./tour.interface"

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
export const tourControllers = {
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType
}