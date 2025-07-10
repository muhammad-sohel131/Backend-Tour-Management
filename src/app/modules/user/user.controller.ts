/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserServices.createUser(req.body)
  
  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Created Successfully",
    data: user
  })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {data, meta} = await UserServices.getAllUsers()

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Users Retrieved Successfully",
    data,
    meta
  })
})


export const userController = {
  createUser,
  getAllUsers
};
