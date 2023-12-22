import * as common_type from "./common_type";
import * as payload_type from "./payload_type";

interface ICreateStaffAuthToken {
  createAuthOToken({
    payload,
    secretKey,
    expiresIn,
  }: {
    payload: payload_type.IStaffPayload;
    secretKey: string;
    expiresIn: string;
  }): Promise<string>;
}

interface ICreateUserAuthToken {
  createAuthOToken({
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
  extends ICreateStaffAuthToken,
    IComparePassword {}

export interface IUserMethods extends ICreateUserAuthToken, IComparePassword {}
