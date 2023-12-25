import mongoose from "mongoose";
import * as common_type from "./common_type";
import { IUserMethods } from "./document_method";

// user schema & model type
export interface IUserSchema
  extends common_type.IName,
    common_type.IEmail,
    common_type.IPassword,
    common_type.IGender,
    common_type.IPhone,
    common_type.IProfileImage,
    common_type.ICountry,
    common_type.ICity,
    common_type.IHouseNumberOrName,
    common_type.IPostCode,
    common_type.IUserRole {}

export interface IUserModel
  extends mongoose.Model<IUserSchema, {}, IUserMethods> {}

// user document type
export interface IUserDocument
  extends mongoose.Document,
    IUserSchema,
    IUserMethods {
  _id: mongoose.Types.ObjectId;
}

export interface IUserDocumentExceptPassword
  extends Omit<IUserDocument, "password"> {}

export type THydratedUserDocument = mongoose.HydratedDocument<IUserDocument>;

export type THydratedUserDocumentExceptPassword =
  mongoose.HydratedDocument<IUserDocumentExceptPassword>;

export type TRemovedUserDocument = mongoose.ModifyResult<THydratedUserDocument>;

// user controller type
export interface IPostVerifyEmail extends common_type.IVerifyNewEmail {}

export interface IPostRegisterUser extends common_type.IRegister {}

export interface IPostLoginUser extends common_type.ILogin {}

export interface IPutUpdateUser extends common_type.IUpdateAccount {}

export interface IPostForgotUserPassword extends common_type.IForgotPassword {}

export interface IPatchResetUserPassword extends common_type.IResetPassword {}

export interface IPatchChangeUserPassword extends common_type.IChangePassword {}

export interface IPostVerifyUserEmail extends common_type.IVerifyAccountEmail {}

export interface IPatchUserEmail extends common_type.IToken {}

// user service type
interface IUserDocumentProp {
  user: IUserDocument;
}

export interface IFindUserByProp {
  key: "_id" | "email";
  value: string | mongoose.Types.ObjectId;
}

export interface ICreateNewUser {
  data: {
    name: string;
    email: string;
    password: string;
  };
}

export interface IFindUsers
  extends common_type.ISkipLimit,
    common_type.ISortType,
    common_type.ISearchBy {}

export interface IUpdateUserById extends common_type.IObjectIdOrString {
  data: common_type.IUpdateAccount;
}

export interface ICreateUserAuthTokens extends IUserDocumentProp {}

export interface IUserAuthTokens extends common_type.IAuthTokens {}

export interface IMatchUserPassword
  extends common_type.IPassword,
    IUserDocumentProp {}

export interface IUpdateUserPassword
  extends IUserDocumentProp,
    common_type.INewPassword {}

export interface IUpdateUserEmail
  extends IUserDocumentProp,
    common_type.INewEmail {}

export interface IRemoveUserById extends common_type.IObjectIdOrString {}
