import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { user_service, mailer, redis_service } from "../../services";
import { user_validator } from "../../validators";
import {
  response,
  errorReducer,
  token,
  email_template,
  document_extractor,
  create_cache_key,
} from "../../utils";
import { common_type, user_type } from "../../types";
import dotenvconfig from "../../config/dotenvconfig";

export const postVerifyEmail: RequestHandler = async (req, res, next) => {
  const { value, error } = user_validator.verify_email_validate_schema.validate(
    {
      name: req.body?.name,
      email: req.body?.email,
      password: req.body?.password,
    }
  );

  if (error) {
    return response.responseErrorMessages(res, 400, {
      errors: errorReducer(error.details),
    });
  }

  try {
    const user: user_type.THydratedUserDocument | null =
      await user_service.findUserByProp({ key: "email", value: value.email });

    if (user) {
      return response.responseErrorMessage(res, 409, {
        error: "E-mail already exists! please try again using a new one",
      });
    }

    const access_token: string = token.registerAccountToken({
      payload: {
        name: value.name,
        email: value.email,
        password: value.password,
      },
      secretKey: dotenvconfig.JWT_ACCESS,
      expiresIn: "15m",
    });

    const email_body: common_type.IEmailBody =
      email_template.registerAccountEmailTemplate({
        account: "user",
        receiver_email: value.email,
        receiver_name: value.name,
        access_token,
      });

    const message: string = `Email has been sent to ${value.email}, please check your email and follow the instructions to complete registration`;

    return mailer.sendEmail(res, email_body, message);
  } catch (e) {
    return next(e);
  }
};

export const postRegisterUser: RequestHandler = async (req, res, next) => {
  const { value, error } =
    user_validator.register_user_validate_schema.validate({
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

        const decoded_token = decoded as user_type.IPostVerifyEmail;

        const user: user_type.THydratedUserDocument | null =
          await user_service.findUserByProp({
            key: "email",
            value: decoded_token.email,
          });

        if (user) {
          return response.responseErrorMessage(res, 409, {
            error: "Email already exists! please try again using a new one",
          });
        }

        const new_user: user_type.THydratedUserDocument | null =
          await user_service.createNewUser({
            data: {
              name: decoded_token.name,
              email: decoded_token.email,
              password: decoded_token.password,
            },
          });

        if (!new_user) {
          return response.responseErrorMessage(res, 500, {
            error: "Server error occurred! please try again",
          });
        }

        const { access_token, refresh_token } =
          (await user_service.createUserAuthTokens({
            user: new_user,
          })) as user_type.IUserAuthTokens;

        const { data_except_password } = document_extractor.extractUserDocument(
          { user: new_user }
        );

        // clear cached users
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
          201,
          {
            code: 201,
            message: "Registered successfully",
            access_token,
            user: data_except_password,
            links: {
              self: "/auth/users/register",
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

export const postLoginUser: RequestHandler = async (req, res, next) => {
  const { value, error } = user_validator.login_validate_schema.validate({
    email: req.body?.email,
    password: req.body?.password,
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
        error: "user not found!",
      });
    }

    const is_match_password: boolean = await user_service.isMatchUserPassword({
      user,
      password: value.password,
    });

    if (!is_match_password) {
      return response.responseErrorMessage(res, 401, {
        error: "Password does not match!",
      });
    }

    const { access_token, refresh_token } =
      await user_service.createUserAuthTokens({ user });

    const { data_except_password } = document_extractor.extractUserDocument({
      user,
    });

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

    return response.responseSuccessDataAndSaveCookie(res, refresh_token, 200, {
      code: 200,
      message: "Logged in successfully",
      access_token,
      user: data_except_password,
      links: {
        self: "/auth/users/login",
        profile: `/users/u/${data_except_password._id}/profile`,
      },
    });
  } catch (e) {
    return next(e);
  }
};

export const postLogoutUser: RequestHandler = async (req, res, next) => {
  const refresh_token = req.cookies?.refresh_token as string;

  if (!refresh_token) {
    return response.responseErrorMessage(res, 401, { error: "Unauthorized!" });
  }

  try {
    return response.responseSuccessDataAndClearCookie(res, 200, {
      code: 200,
      message: "Logged out successfully",
      links: {
        self: "/auth/users/logout",
        login: "/auth/users/login",
      },
    });
  } catch (e) {
    return next(e);
  }
};

export const postForgotPassword: RequestHandler = async (req, res, next) => {
  const { value, error } =
    user_validator.forgot_password_validate_schema.validate({
      email: req.body?.email,
    });

  if (error) {
    return response.responseErrorMessage(res, 400, {
      error: error.details[0].message,
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

    const access_token: string = token.resetPasswordToken({
      payload: { email: user.email },
      secretKey: dotenvconfig.JWT_ACCESS,
      expiresIn: "15m",
    });

    const email_body: common_type.IEmailBody =
      email_template.resetAccountPasswordEmailTemplate({
        receiver_email: user.email,
        receiver_name: user.name,
        access_token,
      });

    const message: string = `Email has beens sent to ${value.email}, please check your email and follow the instructions to reset your password`;

    return mailer.sendEmail(res, email_body, message);
  } catch (e) {
    return next(e);
  }
};

export const postVerifyuserEmail: RequestHandler = async (req, res, next) => {
  const { value, error } =
    user_validator.verify_user_email_validate_schema.validate({
      email: req.body?.email,
      new_email: req.body?.new_email,
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
        error: "Account not found!",
      });
    }

    const access_token: string = token.updateAccountEmailToken({
      payload: {
        email: value.email,
        new_email: value.new_email,
      },
      secretKey: dotenvconfig.JWT_ACCESS,
      expiresIn: "15m",
    });

    const email_body: common_type.IEmailBody =
      email_template.updateAccountEmailTemplate({
        receiver_email: value.email,
        receiver_name: user.name,
        access_token,
        account: "user",
      });

    const message: string = `Email has been sent to ${value.email}, please check your email and follow the instructions to update your email`;

    return mailer.sendEmail(res, email_body, message);
  } catch (e) {
    return next(e);
  }
};
