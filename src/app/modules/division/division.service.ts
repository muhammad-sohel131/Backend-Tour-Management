import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";

const createDivision = async (payload: Partial<IDivision>) => {
  const { name } = payload;
  const isNameExist = await Division.findOne({ name });

  if (isNameExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Use Unique Name");
  }

  const baseSlug = name?.split(" ").join("-").concat("-division").toLowerCase();
  payload.slug = baseSlug;

  const division = await Division.create(payload);

  return division;
};

const getAllDivision = async () => {
  const data = await Division.find();
  const total = await Division.countDocuments();

  return {
    data,
    meta: {
      total,
    },
  };
};

const updateDivision = async (
  divisionId: string,
  payload: Partial<IDivision>
) => {
  const isDivisionExist = await Division.findById(divisionId);
  if (!isDivisionExist) {
    throw new AppError(httpStatus.FORBIDDEN, "Division is not found");
  }

  const isNameExist = await Division.findOne({
    name: payload.name,
    _id: { $ne: divisionId },
  });

  if (isNameExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Division Name is Already Exist"
    );
  }

  const baseSlug = payload.name
    ?.split(" ")
    .join("-")
    .concat("-division")
    .toLowerCase();

  payload.slug = baseSlug;

  const updatedDivision = await Division.findByIdAndUpdate(
    divisionId,
    payload,
    { new: true, runValidators: true }
  );
  return updatedDivision;
};

const deleteDivision = async (divisionId: string) => {
  // handle case where division is associated with tour

  const deletedDivision = await Division.findByIdAndDelete(divisionId);

  return deletedDivision;
};
export const divisionService = {
  getAllDivision,
  createDivision,
  updateDivision,
  deleteDivision,
};
