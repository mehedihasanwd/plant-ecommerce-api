import * as premade_schema from "./common_validator_schema";
import { category_type } from "../types";
import joi from "joi";

// utils
const name_schema: joi.StringSchema<string> = premade_schema.string_schema
  .required()
  .min(4)
  .max(5)
  .valid("fruit", "flower", "herb", "indoor")
  .messages({
    "string.base": "Name should be a string!",
    "string.empty": "Name is required!",
    "string.min": "Name should contain at least 4 characters",
    "string.max": "Name should not exceed 5 characters",
    "any.only": "Name should be either: 'fruit', 'flower', 'herb' or 'indoor'",
  });

// validators
export const post_new_category_validate_schema: joi.ObjectSchema<category_type.IPostNewCategory> =
  joi
    .object({
      name: name_schema,
      description: premade_schema.description,
    })
    .required();

export const put_category_validate_schema: joi.ObjectSchema<category_type.IPutCategory> =
  post_new_category_validate_schema;

export const patch_category_status_validate_schema: joi.ObjectSchema<category_type.IPatchCategoryStatus> =
  joi
    .object({
      status: premade_schema.status_schema,
    })
    .required();
