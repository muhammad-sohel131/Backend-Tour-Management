import {Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...roles : string[]) => async(req: Request, res: Response, next: NextFunction) => {
  try{
    const accessToken = req.headers.authorization;
    if(!accessToken){
      throw new AppError(403, 'Missing Access Token')
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

    if(!verifiedToken){
      throw new AppError(403, 'You are not authorized')
    }


    if(!roles.includes(verifiedToken.role)){
      throw new AppError(403, "You are not permitted to view this route!!!")
    }

    req.user = verifiedToken
    next()
  }catch(error){
    next(error)
  }
}