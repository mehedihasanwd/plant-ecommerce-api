import joi from "joi";
import { user_type } from "../types";
import * as common_validator_schema from "./common_validator_schema";

export const verify_email_validate_schema: joi.ObjectSchema<user_type.IPostVerifyEmail> =
  joi.object({
    name: common_validator_schema.name_schema,
    email: common_validator_schema.email_schema,
    password: common_validator_schema.password_schema,
  });

export const register_user_validate_schema: joi.ObjectSchema<user_type.IPostRegisterUser> =
  joi.object({
    token: common_validator_schema.token_schema,
  });

export const login_validate_schema: joi.ObjectSchema<user_type.IPostLoginUser> =
  joi.object({
    email: common_validator_schema.email_schema,
    password: common_validator_schema.password_schema,
  });

export const forgot_password_validate_schema: joi.ObjectSchema<user_type.IPostForgotUserPassword> =
  joi.object({
    email: common_validator_schema.email_schema,
  });

export const reset_password_validate_schema: joi.ObjectSchema<user_type.IPatchResetUserPassword> =
  joi.object({
    token: common_validator_schema.token_schema,
  });

export const change_password_validate_schema: joi.ObjectSchema<user_type.IPatchChangeUserPassword> =
  joi.object({
    email: common_validator_schema.email_schema,
    password: common_validator_schema.password_schema,
    new_password: common_validator_schema.new_password_schema,
  });

export const verify_user_email_validate_schema: joi.ObjectSchema<user_type.IPostVerifyUserEmail> =
  joi.object({
    email: common_validator_schema.email_schema,
    new_email: common_validator_schema.new_email_schema,
  });

export const update_user_email_validate_schema: joi.ObjectSchema<user_type.IPatchUserEmail> =
  joi.object({
    token: common_validator_schema.token_schema,
  });

export const update_user_by_id: joi.ObjectSchema<user_type.IPutUpdateUser> =
  joi.object({
    name: common_validator_schema.name_schema,
    gender: common_validator_schema.gender_schema,
    phone: common_validator_schema.phone_schema,
    country: common_validator_schema.country_schema,
    city: common_validator_schema.city_schema,
    house_number_or_name: common_validator_schema.house_number_or_name_schema,
    post_code: common_validator_schema.post_code_schema,
  });
