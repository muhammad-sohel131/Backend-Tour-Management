/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";


export const globalErrorHandle = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something wen wrong!! ${err.message}`;
   const errorsSource: any = []

  // duplicate error
  if (err.code === 11000) {
    statusCode = 400;
    message = `${req.body.email} is already exist`;

    // Object Id / mongoose id
  } else if(err.name === 'CastError'){
    statusCode = 400
    message = 'Invalid MongoDB Object Id'

    // Zod Validation Error
  }else if(err.name === 'ZodError'){
    message = "Zod Error"
    statusCode = 400

    console.log(err)

    // mongoose validation error
  }else if(err.name == 'ValidationError'){
    statusCode= 400
    const errors = Object.values(err.errors)

    errors.forEach((errorObject: any) => errorsSource.push({
      path: errorObject.path,
      message: errorObject.message
    }))
    
    message = "Validation Error"
  }else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorsSource,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
