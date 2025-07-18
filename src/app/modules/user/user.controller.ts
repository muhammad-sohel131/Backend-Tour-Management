/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserServices.createUser(req.body)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Created Successfully",
    data: user
  })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const verifiedToken = req.user
  const payload = req.body
  
  const user = await UserServices.updateUser(userId, payload, verifiedToken) as IUser

  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Updated Successfully",
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
  getAllUsers,
  updateUser
};
