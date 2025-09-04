/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const { accessToken, refreshToken } = createUserTokens(isUserExist);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found.");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already saved you password. Now you can change password from profile."
    );
  }

  user!.password = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];
  user.auths = auths;
  user!.save();

  return true;
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMatched = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );

  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
  }

  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();

  return true;
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Use does not found!");
  }

  const JwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = jwt.sign(JwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUrlLink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;

  sendEmail({
    to: user.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: user.name,
      resetUrlLink,
    },
  });
};

const resetPassword = async (
  decodedToken: JwtPayload,
  userId: string,
  plainPassword: string
) => {
  if(decodedToken.userId !== userId){
    throw new AppError(httpStatus.BAD_REQUEST, "You can not reset this password")
  }
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found.");
  }


  user!.password = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();

  return true;
};
export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  setPassword,
  changePassword,
  forgotPassword,
  resetPassword,
};
// http://localhost:5173/reset-password?id=687dcf51a5410a22d48e2f10&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdkY2Y1MWE1NDEwYTIyZDQ4ZTJmMTAiLCJlbWFpbCI6InBob25lLmZpbmRlcjk3OUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1Njk5MTg2NCwiZXhwIjoxNzU2OTkyNDY0fQ.s5ieVaQTyPm0N7l3Ws6XrzJd7dWtX4KV-bk4mQrTR7U
