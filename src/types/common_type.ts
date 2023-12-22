import mongoose from "mongoose";
import { UploadedFile } from "express-fileupload";

// types
export type TUploadedFile = UploadedFile;
export type TStatus = "active" | "inactive";
export type TUserRole = "user";
export type TStaffRole = "admin" | "editor" | "guest";
export type TAllRole = "user" | "admin" | "editor" | "guest";
export type TGender = "man" | "woman" | "select";
export type TSize = "S" | "M" | "L" | "XL";
export type TSort = "asc" | "dsc";
export type TCategory = "flower" | "fruit" | "indoor" | "herb";
export type TTopcategory =
  | "Featured"
  | "Bestseller"
  | "Highestrated"
  | "Regular";

// prop interfaces
export interface IObjectIdOrString {
  _id: string | mongoose.Types.ObjectId;
}

export interface IObjectId {
  _id: mongoose.Schema.Types.ObjectId;
}

export interface IKey {
  key: string;
}

export interface IUrl {
  url: string;
}

export interface IsChangedSelf {
  isChangedSelf: boolean;
}

export interface ImageProps extends IKey, IUrl {}

export interface IProfileImageProps extends IKey, IUrl, IsChangedSelf {}

export interface IImage {
  image: ImageProps;
}

export interface IProfileImage {
  image: IProfileImageProps;
}

export interface IName {
  name: string;
}

export interface IDescription {
  description: string;
}

export interface ISlug {
  slug: string;
}

export interface IStatus {
  status: TStatus;
}

export interface IUserRole {
  role: TUserRole;
}

export interface IStaffRole {
  role: TStaffRole;
}

export interface IAllRole {
  role: TAllRole;
}

export interface IEmail {
  email: string;
}

export interface IPassword {
  password: string;
}

export interface IGender {
  gender: TGender;
}

export interface IPhone {
  phone: string;
}

export interface ICountry {
  country: string;
}

export interface ICity {
  city: string;
}

export interface IHouseNumberOrName {
  house_number_or_name: string;
}

export interface IPostCode {
  post_code: number;
}

export interface IOriginalPrice {
  original_price: number;
}

export interface IPrice {
  price: number;
}

export interface IDiscount {
  discount: number;
}

export interface InStock {
  in_stock: number;
}

export interface ISizes {
  sizes: TSize[];
}

export interface ICategory {
  category: TCategory;
}

export interface ITotalRatings {
  total_ratings: number;
}

export interface IAverageRating {
  average_rating: number;
}

export interface ITotalReviews {
  total_reviews: number;
}

export interface ISales {
  sales: number;
}

export interface ITopCategory {
  top_category: TTopcategory;
}

export interface IUserId {
  user_id: string | mongoose.Schema.Types.ObjectId;
}

export interface IOrderId {
  order_id: string | mongoose.Schema.Types.ObjectId;
}

export interface IProductId {
  product_id: string | mongoose.Schema.Types.ObjectId;
}

export interface IProductUid {
  product_uid: string;
}

export interface IQuantity {
  quantity: number;
}

export interface ISize {
  size: TSize;
}

export interface IShippingAddressProps
  extends ICountry,
    ICity,
    IHouseNumberOrName,
    IPhone,
    IPostCode {}

export interface IShippingAddress {
  shipping_address: IShippingAddressProps;
}

export interface IReview {
  review: string;
}

export interface IRating {
  rating: number;
}

export interface IExpireDate {
  expire_date: string | mongoose.Schema.Types.Date;
}

export interface IError extends Error {
  status?: number;
}

// user & staff shared interfaces
export interface IValue {
  value: string | mongoose.Types.ObjectId;
}

export interface IToken {
  token: string;
}

export interface INewEmail {
  new_email: string;
}

export interface INewPassword {
  new_password: string;
}

export interface IVerifyNewEmail extends IName, IEmail, IPassword {}

export interface IVerifyAccountEmail extends IEmail, INewEmail {}

export interface IRegister extends IToken {}

export interface ILogin extends IEmail, IPassword {}

export interface IForgotPassword extends IEmail {}

export interface IResetPassword extends IToken, INewPassword {}

export interface IChangePassword extends IEmail, IPassword, INewPassword {}

export interface IUpdateEmail extends IToken {}

export interface IUpdateAccount extends IName {
  gender?: TGender;
  phone?: string;
  country?: string;
  city?: string;
  house_number_or_name?: string;
  post_code?: number;
  image?: IProfileImageProps;
}

export interface IAccessToken {
  access_token: string;
}

export interface IRefreshToken {
  refresh_token: string;
}

export interface IAuthTokens extends IAccessToken, IRefreshToken {}

export interface ISkipLimit {
  skip?: number;
  limit?: number;
}

export interface ISortType {
  sort_type: TSort;
}

export interface ISearchBy {
  search_by?: string;
}

export interface IAccountDataExceptRole {}
