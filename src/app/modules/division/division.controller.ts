/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IDivision } from "./division.interface";
import httpStatus from "http-status-codes";
import { divisionService } from "./division.service";
import { JwtPayload } from "jsonwebtoken";

const getDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data, meta } = await divisionService.getAllDivision();

    sendResponse<IDivision[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users Retrieved Successfully",
      data,
      meta,
    });
  }
);

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await divisionService.createDivision(req.body);

    sendResponse<IDivision>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division is created",
      data: division,
    });
  }
);

const updateDivision = catchAsync(async(req: Request, res: Response) => {
    const userId = req.params.id
    const updatedDivision = await divisionService.updateDivision(userId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Division Updated Successfully',
        data: updatedDivision
    })
})

const deleteDivision = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const deletedDivision = await divisionService.deleteDivision(userId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Division is Deleted!",
        data: deletedDivision
    })
})
export const divisionController = {
  getDivision,
  createDivision,
  updateDivision,
  deleteDivision
};
