import mongoose from "mongoose";
import * as common_type from "./common_type";
import * as payload_type from "./payload_type";

interface ICreateRefreshTokenParam {
  payload: {
    _id: string | mongoose.Schema.Types.ObjectId;
  };

  secretKey: string;

  expiresIn: string;
}

interface ICreateRefreshToken {
  createRefreshToken({
    payload,
    secretKey,
    expiresIn,
  }: ICreateRefreshTokenParam): Promise<string>;
}

interface ICreateStaffAccessToken {
  createAccessToken({
    payload,
    secretKey,
    expiresIn,
  }: {
    payload: payload_type.IStaffPayload;
    secretKey: string;
    expiresIn: string;
  }): Promise<string>;
}

interface ICreateUserAccessToken {
  createAccessToken({
    payload,
    secretKey,
    expiresIn,
  }: {
    payload: payload_type.IUserPayload;
    secretKey: string;
    expiresIn: string;
  }): Promise<string>;
}

interface IComparePassword {
  comparePassword({ password }: common_type.IPassword): Promise<boolean>;
}

export interface IStaffMethods
  extends ICreateRefreshToken,
    ICreateStaffAccessToken,
    IComparePassword {}

export interface IUserMethods
  extends ICreateRefreshToken,
    ICreateUserAccessToken,
    IComparePassword {}
