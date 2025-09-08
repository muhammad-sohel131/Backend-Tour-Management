/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifiedToken = req.user as JwtPayload;

    const user = (await UserServices.getMe(verifiedToken.userId)) as IUser;

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    const user = (await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    )) as IUser;

    sendResponse<IUser>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data } = await UserServices.getAllUsers();

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users Retrieved Successfully",
      data
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
  getMe
};
