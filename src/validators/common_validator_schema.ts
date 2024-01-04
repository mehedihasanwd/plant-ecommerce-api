import joi from "joi";

// utility
export const string_schema = joi.string().trim();

export const number_schema = joi.number();

// staff & user
export const name_schema: joi.StringSchema<string> = string_schema
  .required()
  .messages({
    "string.base": "Name should be a string!",
    "string.min": "Name should be contain more than 4 characters!",
    "string.empty": "Name is required!",
  });

export const email_generic: joi.StringSchema<string> = string_schema
  .required()
  .email({
    maxDomainSegments: 2,
    tlds: {
      allow: ["com", "net", "info"],
    },
  });

export const email_schema: joi.StringSchema<string> = email_generic.messages({
  "string.base": "Email should be a string!",
  "string.empty": "Email is required!",
  "string.email": "Please provide a valid email address",
  "string.maxDomainSegments": "Email should have at most 2 domain segments",
  "string.tlds":
    "Email should have a valid top-level domain (TLD). Allowed TLDs are: .com, .net, .info",
});

export const new_email_schema: joi.StringSchema<string> =
  email_generic.messages({
    "string.base": "New email should be a string!",
    "string.empty": "New email is required!",
    "string.email": "Please provide a valid email address",
    "string.maxDomainSegments":
      "New email should have at most 2 domain segments",
    "string.tlds":
      "New email should have a valid top-level domain (TLD). Allowed TLDs are: .com, .net, .info",
  });

const password_generic: joi.StringSchema<string> = string_schema
  .required()
  .min(8)
  .max(15)
  .pattern(
    new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  );

export const password_schema: joi.StringSchema<string> =
  password_generic.messages({
    "string.base": "Password should be a string!",
    "password.pattern.base":
      "Password should be 8 characters long at least, contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character",
    "string.empty": "Password is required!",
  });

export const new_password_schema: joi.StringSchema<string> =
  password_generic.messages({
    "string.base": "New password should be a string!",
    "password.pattern.base":
      "New password should be 8 characters long at least, contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character",
    "string.empty": "New password is required!",
  });

export const gender_schema: joi.StringSchema<string> = string_schema
  .valid("man", "woman", "select")
  .messages({
    "string.base": "Gender should be a string!",
    "any.only": "Gender should be either 'man', 'woman' or 'custom'",
  });

export const phone_schema: joi.StringSchema<string> = string_schema
  .max(15)
  .messages({
    "string.base": "Phone should be string!",
  });

export const country_schema: joi.StringSchema<string> = string_schema.messages({
  "string.base": "County should be a string!",
});

export const city_schema: joi.StringSchema<string> = string_schema.messages({
  "string.base": "City should be a string!",
});

export const house_number_or_name_schema: joi.StringSchema<string> =
  string_schema.messages({
    "string.base": "House number of name should be a string!",
  });

export const post_code_schema: joi.NumberSchema<number> =
  number_schema.messages({
    "number.base": "Postal code should be a number!",
  });

export const token_schema: joi.StringSchema<string> = string_schema
  .required()
  .messages({
    "string.base": "Token should be a string!",
    "string.empty": "Token is required!",
  });

export const status_schema: joi.StringSchema<string> = string_schema
  .required()
  .valid("active", "inactive")
  .messages({
    "string.base": "Status should be a string!",
    "string.empty": "Status is required!",
    "any.only": "Status should be either: 'active' or 'inactive'",
  });
