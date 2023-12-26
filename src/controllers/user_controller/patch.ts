import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { staff_service, redis_service } from "../../services";
import { staff_validator } from "../../validators";
import {
  response,
  errorReducer,
  document_extractor,
  create_cache_key,
  isValidParamId,
} from "../../utils";
import { common_type, staff_type } from "../../types";
import dotenvconfig from "../../config/dotenvconfig";

export const patchResetStaffPassword: RequestHandler = async (
  req,
  res,
  next
) => {
  const { value, error } =
    staff_validator.reset_password_validate_schema.validate({
      token: req.body?.token,
    });

  if (error) {
    return response.responseErrorMessage(res, 400, {
      error: error.details[0].message,
    });
  }

  try {
    jwt.verify(
      value.token,
      dotenvconfig.JWT_ACCESS,
      async (
        err: jwt.VerifyErrors | null,
        decoded: jwt.JwtPayload | string | undefined
      ) => {
        if (err) {
          return response.responseErrorMessage(res, 401, {
            error:
              "Invalid token or expired! please try again using a valid one",
          });
        }

        const decoded_token = decoded as common_type.IForgotPassword;

        const staff: staff_type.THydratedStaffDocument | null =
          await staff_service.findStaffByProp({
            key: "email",
            value: decoded_token.email,
          });

        if (!staff) {
          return response.responseErrorMessage(res, 404, {
            error: "There is no account exists with this email!",
          });
        }

        const updated_staff: staff_type.THydratedStaffDocument | null =
          await staff_service.updateStaffPassword({
            staff,
            new_password: value.new_password,
          });

        if (!updated_staff) {
          return response.responseErrorMessage(res, 500, {
            error: "Server error occurred! please try again",
          });
        }

        const { access_token, refresh_token } =
          await staff_service.createStaffAuthTokenTokens({
            staff: updated_staff,
          });

        const { data_except_password } =
          document_extractor.extractStaffDocument({ staff: updated_staff });

        // clear staffs from cache
        await redis_service.clearKeys({ key: "staffs" });

        // save staff in cache (3600 * 24 * 2 = for 2 days)
        const cache_key: string = create_cache_key.createKeyForDocument({
          key: "staff",
          value: data_except_password._id.toString(),
        });

        await redis_service.saveToCache({
          key: cache_key,
          document: data_except_password,
          EX: 3600 * 24 * 2,
        });

        return response.responseSuccessDataAndSaveCookie(
          res,
          refresh_token,
          200,
          {
            code: 200,
            message: "Password reset successfully",
            access_token,
            staff: data_except_password,
            links: {
              self: "/auth/staffs/reset-password",
              profile: `/staffs/s/${data_except_password._id}/profile`,
            },
          }
        );
      }
    );
  } catch (e) {
    return next(e);
  }
};

export const patchChangeStaffPassword: RequestHandler = async (
  req,
  res,
  next
) => {
  const { value, error } =
    staff_validator.change_password_validate_schema.validate({
      email: req.body?.email,
      password: req.body?.password,
      new_password: req.body?.new_password,
    });

  if (error) {
    return response.responseErrorMessages(res, 400, {
      errors: errorReducer(error.details),
    });
  }

  try {
    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({ key: "email", value: value.email });

    if (!staff) {
      return response.responseErrorMessage(res, 404, {
        error: "There is no account exists with this email!",
      });
    }

    const is_match_password: boolean = await staff_service.isMatchStaffPassword(
      { staff, password: value.password }
    );

    if (!is_match_password) {
      return response.responseErrorMessage(res, 401, {
        error: "Old password does not match!",
      });
    }

    const updated_staff: staff_type.THydratedStaffDocument | null =
      await staff_service.updateStaffPassword({
        staff,
        new_password: value.new_password,
      });

    if (!updated_staff) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    const { data_except_password } = document_extractor.extractStaffDocument({
      staff: updated_staff,
    });

    return response.responseSuccessData(res, 200, {
      code: 200,
      message: "Password changed successfully",
      staff: data_except_password,
      links: {
        self: "/auth/staffs/change-passwor",
        profile: `/staffs/s/${data_except_password._id}/profile`,
      },
    });
  } catch (e) {
    return next(e);
  }
};

export const patchUpdateStaffEmail: RequestHandler = async (req, res, next) => {
  const { value, error } =
    staff_validator.update_staff_email_validate_schema.validate({
      token: req.body?.token,
    });

  if (error) {
    return response.responseErrorMessage(res, 400, {
      error: error.details[0].message,
    });
  }

  try {
    jwt.verify(
      value.token,
      dotenvconfig.JWT_ACCESS,
      async (
        err: jwt.VerifyErrors | null,
        decoded: jwt.JwtPayload | string | undefined
      ) => {
        if (err) {
          return response.responseErrorMessage(res, 401, {
            error:
              "Invalid token or expired! please try again using a valid one",
          });
        }

        const decoded_token = decoded as staff_type.IPostVerifyStaffEmail;

        const staff: staff_type.THydratedStaffDocument | null =
          await staff_service.findStaffByProp({
            key: "email",
            value: decoded_token.email,
          });

        if (!staff) {
          return response.responseErrorMessage(res, 404, {
            error: "There is no account exists with this email!",
          });
        }

        const updated_staff: staff_type.THydratedStaffDocument | null =
          await staff_service.updateStaffEmail({
            staff,
            new_email: decoded_token.new_email,
          });

        if (!updated_staff) {
          return response.responseErrorMessage(res, 500, {
            error: "Server error occurred! please try again",
          });
        }

        const { access_token } = await staff_service.createStaffAuthTokenTokens(
          { staff: updated_staff }
        );

        const { data_except_password } =
          document_extractor.extractStaffDocument({ staff: updated_staff });

        // clear staffs from cache
        await redis_service.clearKeys({ key: "staffs" });

        // save staff in cache (3600 * 24 * 2 - for 2 days)
        const cache_key: string = create_cache_key.createKeyForDocument({
          key: "staff",
          value: data_except_password._id.toString(),
        });

        await redis_service.saveToCache({
          key: cache_key,
          document: data_except_password,
          EX: 3600 * 24 * 2,
        });

        return response.responseSuccessData(res, 200, {
          code: 200,
          message: "Email updated successfully",
          access_token,
          staff: data_except_password,
          links: {
            self: "/auth/staffs/update-staff-email",
            profile: `/staffs/s/${data_except_password._id}/profile`,
          },
        });
      }
    );
  } catch (e) {
    return next(e);
  }
};

export const patchUpdateStaffRoleById: RequestHandler = async (
  req,
  res,
  next
) => {
  const _id = req.params?.staffId;

  const { value, error } =
    staff_validator.update_staff_role_validate_schema.validate({
      role: req.body?.role,
    });

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid staff id! please try again using a valid one",
    });
  }

  if (error) {
    return response.responseErrorMessage(res, 400, {
      error: error.details[0].message,
    });
  }

  try {
    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({ key: "_id", value: _id });

    if (!staff) {
      return response.responseErrorMessage(res, 404, {
        error: "Staff not found!",
      });
    }

    const updated_staff: staff_type.THydratedStaffDocument | null =
      await staff_service.updateStaffRoleById({ _id, role: value.role });

    if (!updated_staff) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    const { data_except_password } = document_extractor.extractStaffDocument({
      staff: updated_staff,
    });

    // clear staffs from cache
    await redis_service.clearKeys({ key: "staffs" });

    // save staff in cache (3600 * 24 * 2 - for 2 days)
    const cache_key: string = create_cache_key.createKeyForDocument({
      key: "staff",
      value: data_except_password._id.toString(),
    });

    await redis_service.saveToCache({
      key: cache_key,
      document: data_except_password,
      EX: 3600 * 25 * 2,
    });

    return response.responseSuccessData(res, 200, {
      code: 200,
      message: "Role updated successfully",
      staff: data_except_password,
      links: {
        self: `/staffs/s/${_id}`,
        staffs: "/dashboard/staffs",
      },
    });
  } catch (e) {
    return next(e);
  }
};
