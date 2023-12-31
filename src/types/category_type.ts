import mongoose from "mongoose";
import * as common_type from "./common_type";

// category schema and model type
interface ICategoryName {
  name: common_type.ICategory;
}

export interface ICategorySchema
  extends ICategoryName,
    common_type.ISlug,
    common_type.IDescription,
    common_type.IImage,
    common_type.IStatus {}

export interface ICategoryModel extends mongoose.Model<ICategorySchema> {}

// category document type
interface ICategoryDocument extends mongoose.Document, ICategorySchema {
  _id: mongoose.Types.ObjectId;
}

export type THydratedCategoryDocument =
  mongoose.HydratedDocument<ICategoryDocument>;

export type TRemovedCategoryDocument =
  mongoose.ModifyResult<THydratedCategoryDocument>;

// category controller type
export interface IPostNewCategory
  extends ICategoryName,
    common_type.IDescription {}

export interface IPatchCategoryStatus extends common_type.IStatus {}

export interface IPutCategory extends IPostNewCategory {}

// category service type
interface ICategoryDataProps extends IPostNewCategory, common_type.IImage {}

export interface IFindCategoryByProp {
  key: "_id" | "name" | "slug";
  value: string | mongoose.Types.ObjectId;
}

export interface IFindCategories
  extends common_type.ISkipLimit,
    common_type.ISearchBy {
  sort_type: "asc" | "dsc" | "active" | "inactive";
}

export interface IFindCategoriesByStatus
  extends common_type.ISkipLimit,
    common_type.ISortType,
    common_type.ISearchBy,
    common_type.IStatus {}

export interface ICreateNewCategory {
  data: ICategoryDataProps;
}

export interface IUpdateCategoryStatusById
  extends common_type.IObjectIdOrString,
    common_type.IStatus {}

export interface IUpdateCategoryById extends common_type.IObjectIdOrString {
  data: {
    name: ICategoryName;
    description: common_type.IDescription;
    image?: common_type.IImage;
  };
}
