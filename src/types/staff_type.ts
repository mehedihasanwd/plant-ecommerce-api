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
  _id: mongoose.Schema.Types.ObjectId;
}

export interface IStaffDocumentExceptPassword
  extends Omit<IStaffDocument, "password"> {}

export type THydratedStaffDocument = mongoose.HydratedDocument<IStaffDocument>;

export type THydratedStaffDocumentExceptPassword =
  mongoose.HydratedDocument<IStaffDocumentExceptPassword>;

export type TRemovedStaffDocument =
  mongoose.ModifyResult<THydratedStaffDocument>;

// staff controller type

// staff service type
