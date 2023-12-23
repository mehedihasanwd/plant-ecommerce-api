import mongoose from "mongoose";
import * as common_type from "./common_type";
import { IStaffMethods } from "./document_method";

// staff schema & model type
export interface IStaffSchema
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
    common_type.IStaffRole {}

export interface IStaffModel
  extends mongoose.Model<IStaffSchema, {}, IStaffMethods> {}

// staff document type
export interface IStaffDocument
  extends mongoose.Document,
    IStaffSchema,
    IStaffMethods {
  _id: mongoose.Types.ObjectId;
}

export interface IStaffDocumentExceptPassword
  extends Omit<IStaffDocument, "password"> {}

export type THydratedStaffDocument = mongoose.HydratedDocument<IStaffDocument>;

export type THydratedStaffDocumentExceptPassword =
  mongoose.HydratedDocument<IStaffDocumentExceptPassword>;

export type TRemovedStaffDocument =
  mongoose.ModifyResult<THydratedStaffDocument>;

// staff controller type
export interface IPostVerifyEmail extends common_type.IVerifyNewEmail {}

export interface IPostRegisterStaff extends common_type.IRegister {}

export interface IPostLoginStaff extends common_type.ILogin {}

export interface IPutUpdateStaff extends common_type.IUpdateAccount {}

export interface IPostForgotStaffPassword extends common_type.IForgotPassword {}

export interface IPatchResetStaffPassword extends common_type.IResetPassword {}

export interface IPatchChangeStaffPassword
  extends common_type.IChangePassword {}

export interface IPostVerifyStaffEmail
  extends common_type.IVerifyAccountEmail {}

export interface IPatchStaffEmail extends common_type.IToken {}

export interface IPatchStaffRole extends common_type.IStaffRole {}

// staff service type
interface IStaffDocumentProp {
  staff: IStaffDocument;
}

export interface IFindStaffByProp {
  key: "_id" | "email";
  value: string | mongoose.Schema.Types.ObjectId;
}

export interface ICreateNewStaff {
  data: {
    name: string;
    email: string;
    password: string;
  };
}

export interface IFindStaffs
  extends common_type.ISkipLimit,
    common_type.ISortType,
    common_type.ISearchBy {}

export interface IUpdateStaffById extends common_type.IObjectIdOrString {
  data: common_type.IUpdateAccount;
}

export interface IUpdateStaffRoleById extends common_type.IObjectIdOrString {
  role: common_type.TStaffRole;
}

export interface ICreateStaffAuthTokens extends IStaffDocumentProp {}

export interface IStaffAuthTokens extends common_type.IAuthTokens {}

export interface IMatchStaffPassword
  extends common_type.IPassword,
    IStaffDocumentProp {}

export interface IUpdateStaffPassword
  extends IStaffDocumentProp,
    common_type.INewPassword {}

export interface IUpdateStaffEmail
  extends IStaffDocumentProp,
    common_type.INewEmail {}

export interface IRemoveStaffById extends common_type.IObjectIdOrString {}
