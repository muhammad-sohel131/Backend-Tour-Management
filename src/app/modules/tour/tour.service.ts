import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchField } from "./tour.const";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes";

const getAllTourTypes = async () => {
  const tourTypes = await TourType.find();

  return tourTypes;
};

const createTourType = async (payload: Partial<ITourType>) => {
  const { name } = payload;
  const isTourTypeExist = await TourType.findOne({ name });

  if (isTourTypeExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Type is Already Exist");
  }

  const createdTourType = await TourType.create(payload);

  return createdTourType;
};

const updateTourType = async (
  tourTypeId: string,
  payload: Partial<ITourType>
) => {
  const { name } = payload;
  const isTourTypeExist = await TourType.findById(tourTypeId);

  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "The Tour Type is not found!");
  }

  const isNameExist = await TourType.findOne({
    name,
    _id: { $ne: tourTypeId },
  });
  if (isNameExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "The Name is Already Used.");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(
    tourTypeId,
    payload,
    { new: true, runValidators: true }
  );

  return updatedTourType;
};

const deleteTourType = async (tourTypeId: string) => {
  const deletedTourType = await TourType.findByIdAndDelete(tourTypeId);

  return deletedTourType;
};

// Tour Services----------------------------------
const createTour = async (payload: Partial<ITour>) => {
  const createdTour = await Tour.create(payload);
  return createdTour;
};

// const getAllTour = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";

//   const page = Number(query.page) || 1
//   const limit = Number(query.limit) || 10
//   const skip = (page - 1) * limit

//   for (const field of excludedField) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: tourSearchField.map((filed) => ({
//       [filed]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
//   const tours = await Tour.find(searchQuery)
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit)

//   const totalTours = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalTours / limit)

//   return {
//     data: tours,
//     meta: {
//       page: page,
//       limit: limit,
//       total: totalTours,
//       totalPage
//     },
//   };
// };

const getAllTour = async (query: Record<string, string>) => {
  const tourBuilders = new QueryBuilder(Tour.find(), query);

  const tours = await tourBuilders
    .search(tourSearchField)
    .filter()
    .sort()
    .fields()
    .paginate()
    .build();
  // const totalTours = await Tour.countDocuments();

  const meta = await tourBuilders.getMeta()

  
  return {
    data: tours,
    meta
  };
};

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
  const isTourExist = await Tour.findById(tourId);

  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour is not found.");
  }

  const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
    runValidators: true,
  });
  return updatedTour;
};

const deleteTour = async (tourId: string) => {
  const isTourExist = await Tour.findById(tourId);
  if (!isTourExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour is not found.");
  }

  const deletedTour = await Tour.findByIdAndDelete(tourId);
  return deletedTour;
};
export const tourServices = {
  getAllTourTypes,
  createTourType,
  updateTourType,
  deleteTourType,
  getAllTour,
  createTour,
  updateTour,
  deleteTour,
};
