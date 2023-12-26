import joi from "joi";
import { staff_type } from "../types";
import * as common_validator_schema from "./common_validator_schema";

const role_schema: joi.StringSchema<string> =
  common_validator_schema.string_schema
    .required()
    .valid("admin", "editor", "guest")
    .messages({
      "string.base": "Role should be a string!",
      "string.empty": "Role is required!",
      "any.only": "Role should be either 'admin', 'editor' or 'guest'",
    });

export const verify_email_validate_schema: joi.ObjectSchema<staff_type.IPostVerifyEmail> =
  joi.object({
    name: common_validator_schema.name_schema,
    email: common_validator_schema.email_schema,
    password: common_validator_schema.password_schema,
  });

export const register_staff_validate_schema: joi.ObjectSchema<staff_type.IPostRegisterStaff> =
  joi.object({
    token: common_validator_schema.token_schema,
  });

export const login_validate_schema: joi.ObjectSchema<staff_type.IPostLoginStaff> =
  joi.object({
    email: common_validator_schema.email_schema,
    password: common_validator_schema.password_schema,
  });

export const forgot_password_validate_schema: joi.ObjectSchema<staff_type.IPostForgotStaffPassword> =
  joi.object({
    email: common_validator_schema.email_schema,
  });

export const reset_password_validate_schema: joi.ObjectSchema<staff_type.IPatchResetStaffPassword> =
  joi.object({
    token: common_validator_schema.token_schema,
    new_password: common_validator_schema.new_password_schema,
  });

export const change_password_validate_schema: joi.ObjectSchema<staff_type.IPatchChangeStaffPassword> =
  joi.object({
    email: common_validator_schema.email_schema,
    password: common_validator_schema.password_schema,
    new_password: common_validator_schema.new_password_schema,
  });

export const verify_staff_email_validate_schema: joi.ObjectSchema<staff_type.IPostVerifyStaffEmail> =
  joi.object({
    email: common_validator_schema.email_schema,
    new_email: common_validator_schema.new_email_schema,
  });

export const update_staff_email_validate_schema: joi.ObjectSchema<staff_type.IPatchStaffEmail> =
  joi.object({
    token: common_validator_schema.token_schema,
  });

export const update_staff_role_validate_schema: joi.ObjectSchema<staff_type.IPatchStaffRole> =
  joi.object({
    role: role_schema,
  });

export const update_staff_by_id: joi.ObjectSchema<staff_type.IPutUpdateStaff> =
  joi.object({
    name: common_validator_schema.name_schema,
    gender: common_validator_schema.gender_schema,
    phone: common_validator_schema.phone_schema,
    country: common_validator_schema.country_schema,
    city: common_validator_schema.city_schema,
    house_number_or_name: common_validator_schema.house_number_or_name_schema,
    post_code: common_validator_schema.post_code_schema,
  });
