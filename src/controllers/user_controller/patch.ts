import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { user_service, redis_service } from "../../services";
import { user_validator } from "../../validators";
import {
  response,
  errorReducer,
  document_extractor,
  create_cache_key,
} from "../../utils";
import { common_type, user_type } from "../../types";
import dotenvconfig from "../../config/dotenvconfig";

export const patchResetUserPassword: RequestHandler = async (
  req,
  res,
  next
) => {
  const { value, error } =
    user_validator.reset_password_validate_schema.validate({
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

        const user: user_type.THydratedUserDocument | null =
          await user_service.findUserByProp({
            key: "email",
            value: decoded_token.email,
          });

        if (!user) {
          return response.responseErrorMessage(res, 404, {
            error: "There is no account exists with this email!",
          });
        }

        const updated_user: user_type.THydratedUserDocument | null =
          await user_service.updateUserPassword({
            user,
            new_password: value.new_password,
          });

        if (!updated_user) {
          return response.responseErrorMessage(res, 500, {
            error: "Server error occurred! please try again",
          });
        }

        const { access_token, refresh_token } =
          await user_service.createUserAuthTokens({
            user: updated_user,
          });

        const { data_except_password } = document_extractor.extractUserDocument(
          { user: updated_user }
        );

        // clear users from cache
        await redis_service.clearKeys({ key: "users" });

        // save user in cache (3600 * 24 * 2 = for 2 days)
        const cache_key: string = create_cache_key.createKeyForDocument({
          key: "user",
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
            user: data_except_password,
            links: {
              self: "/auth/users/reset-password",
              profile: `/users/u/${data_except_password._id}/profile`,
            },
          }
        );
      }
    );
  } catch (e) {
    return next(e);
  }
};

export const patchChangeUserPassword: RequestHandler = async (
  req,
  res,
  next
) => {
  const { value, error } =
    user_validator.change_password_validate_schema.validate({
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
    const user: user_type.THydratedUserDocument | null =
      await user_service.findUserByProp({ key: "email", value: value.email });

    if (!user) {
      return response.responseErrorMessage(res, 404, {
        error: "There is no account exists with this email!",
      });
    }

    const is_match_password: boolean = await user_service.isMatchUserPassword({
      user,
      password: value.password,
    });

    if (!is_match_password) {
      return response.responseErrorMessage(res, 401, {
        error: "Old password does not match!",
      });
    }

    const updated_user: user_type.THydratedUserDocument | null =
      await user_service.updateUserPassword({
        user,
        new_password: value.new_password,
      });

    if (!updated_user) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    const { data_except_password } = document_extractor.extractUserDocument({
      user: updated_user,
    });

    return response.responseSuccessData(res, 200, {
      code: 200,
      message: "Password changed successfully",
      user: data_except_password,
      links: {
        self: "/auth/users/change-passwor",
        profile: `/users/u/${data_except_password._id}/profile`,
      },
    });
  } catch (e) {
    return next(e);
  }
};

export const patchUpdateUserEmail: RequestHandler = async (req, res, next) => {
  const { value, error } =
    user_validator.update_user_email_validate_schema.validate({
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

        const decoded_token = decoded as user_type.IPostVerifyUserEmail;

        const user: user_type.THydratedUserDocument | null =
          await user_service.findUserByProp({
            key: "email",
            value: decoded_token.email,
          });

        if (!user) {
          return response.responseErrorMessage(res, 404, {
            error: "There is no account exists with this email!",
          });
        }

        const updated_user: user_type.THydratedUserDocument | null =
          await user_service.updateUserEmail({
            user,
            new_email: decoded_token.new_email,
          });

        if (!updated_user) {
          return response.responseErrorMessage(res, 500, {
            error: "Server error occurred! please try again",
          });
        }

        const { access_token } = await user_service.createUserAuthTokens({
          user: updated_user,
        });

        const { data_except_password } = document_extractor.extractUserDocument(
          { user: updated_user }
        );

        // clear users from cache
        await redis_service.clearKeys({ key: "users" });

        // save user in cache (3600 * 24 * 2 - for 2 days)
        const cache_key: string = create_cache_key.createKeyForDocument({
          key: "user",
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
          user: data_except_password,
          links: {
            self: "/auth/users/update-user-email",
            profile: `/users/u/${data_except_password._id}/profile`,
          },
        });
      }
    );
  } catch (e) {
    return next(e);
  }
};
