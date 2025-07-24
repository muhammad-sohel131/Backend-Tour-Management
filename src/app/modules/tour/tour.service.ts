import AppError from "../../errorHelpers/AppError"
import { ITour, ITourType } from "./tour.interface"
import { TourType } from "./tour.model"
import httpStatus from 'http-status-codes'

const getAllTourTypes = async() => {
    const tourTypes = await TourType.find()

    return tourTypes
}

const createTourType = async(payload: Partial<ITourType>) => {
    const { name } = payload
    const isTourTypeExist = await TourType.findOne({name})

    if(isTourTypeExist){
        throw new AppError(httpStatus.BAD_REQUEST, 'Tour Type is Already Exist')
    }

    const createdTourType = await TourType.create(payload)

    return createdTourType
}

const updateTourType = async(tourTypeId: string, payload: Partial<ITourType>) => {
    const { name } = payload;
    const isTourTypeExist = await TourType.findById(tourTypeId)

    if(!isTourTypeExist){
        throw new AppError(httpStatus.NOT_FOUND, 'The Tour Type is not found!')
    }

    const isNameExist = await TourType.findOne({name, _id: {$ne: tourTypeId}})
    if(isNameExist){
        throw new AppError(httpStatus.BAD_REQUEST, 'The Name is Already Used.')
    }

    const updatedTourType = await TourType.findByIdAndUpdate(tourTypeId, payload, {new: true, runValidators: true})


    return updatedTourType
}

const deleteTourType = async (tourTypeId: string) => {
    const deletedTourType = await TourType.findByIdAndDelete(tourTypeId)

    return deletedTourType
}


// Tour Services----------------------------------
const createTour = async(payload: Partial<ITour>) => {
    const {title} = payload
    const baseSlug = title?.split(' ').join('-').toLowerCase()
    payload.slug = baseSlug

    
}
export const tourServices = {
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType
}