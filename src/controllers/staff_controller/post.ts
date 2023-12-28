import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { staff_service, mailer, redis_service } from "../../services";
import { staff_validator } from "../../validators";
import {
  response,
  errorReducer,
  token,
  email_template,
  document_extractor,
  create_cache_key,
} from "../../utils";
import { common_type, staff_type } from "../../types";
import dotenvconfig from "../../config/dotenvconfig";

export const postVerifyEmail: RequestHandler = async (req, res, next) => {
  const { value, error } =
    staff_validator.verify_email_validate_schema.validate({
      name: req.body?.name,
      email: req.body?.email,
      password: req.body?.password,
    });

  if (error) {
    return response.responseErrorMessages(res, 400, {
      errors: errorReducer(error.details),
    });
  }

  try {
    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({ key: "email", value: value.email });

    if (staff) {
      return response.responseErrorMessage(res, 409, {
        error:
          "Account already exists with this email! please try again using a new one",
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
        account: "staff",
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

export const postRegisterStaff: RequestHandler = async (req, res, next) => {
  const { value, error } =
    staff_validator.register_staff_validate_schema.validate({
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

        const decoded_token = decoded as staff_type.IPostVerifyEmail;

        const staff: staff_type.THydratedStaffDocument | null =
          await staff_service.findStaffByProp({
            key: "email",
            value: decoded_token.email,
          });

        if (staff) {
          return response.responseErrorMessage(res, 409, {
            error: "Email already exists! please try again using a new one",
          });
        }

        const new_staff: staff_type.THydratedStaffDocument | null =
          await staff_service.createNewStaff({
            data: {
              name: decoded_token.name,
              email: decoded_token.email,
              password: decoded_token.password,
            },
          });

        if (!new_staff) {
          return response.responseErrorMessage(res, 500, {
            error: "Server error occurred! please try again",
          });
        }

        const { access_token, refresh_token } =
          (await staff_service.createStaffAuthTokens({
            staff: new_staff,
          })) as staff_type.IStaffAuthTokens;

        const { data_except_password } =
          document_extractor.extractStaffDocument({ staff: new_staff });

        // send email to super admin
        if (data_except_password.email !== dotenvconfig.SUPER_ADMIN) {
          const email_body: common_type.IEmailBody =
            email_template.emailToSuperAdminTemplate({
              guest_email: data_except_password.email,
              guest_name: data_except_password.name,
            });

          mailer.sendEmailToSuperAdmin(res, email_body);
        }

        // clear cached staffs
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
          201,
          {
            code: 201,
            message: "Registered successfully",
            access_token,
            staff: data_except_password,
            links: {
              self: "/auth/staffs/register",
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

export const postLoginStaff: RequestHandler = async (req, res, next) => {
  const { value, error } = staff_validator.login_validate_schema.validate({
    email: req.body?.email,
    password: req.body?.password,
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
        error: "Staff not found!",
      });
    }

    const is_match_password: boolean = await staff_service.isMatchStaffPassword(
      { staff, password: value.password }
    );

    if (!is_match_password) {
      return response.responseErrorMessage(res, 401, {
        error: "Password does not match!",
      });
    }

    const { access_token, refresh_token } =
      await staff_service.createStaffAuthTokens({ staff });

    const { data_except_password } = document_extractor.extractStaffDocument({
      staff,
    });

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

    return response.responseSuccessDataAndSaveCookie(res, refresh_token, 200, {
      code: 200,
      message: "Logged in successfully",
      access_token,
      staff: data_except_password,
      links: {
        self: "/auth/staffs/login",
        profile: `/staffs/s/${data_except_password._id}/profile`,
      },
    });
  } catch (e) {
    return next(e);
  }
};

export const postLogoutStaff: RequestHandler = async (req, res, next) => {
  const refresh_token = req.cookies?.refresh_token as string;

  if (!refresh_token) {
    return response.responseErrorMessage(res, 401, { error: "Unauthorized!" });
  }

  try {
    return response.responseSuccessDataAndClearCookie(res, 200, {
      code: 200,
      message: "Logged out successfully",
      links: {
        self: "/auth/staffs/logout",
        login: "/auth/staffs/login",
      },
    });
  } catch (e) {
    return next(e);
  }
};

export const postForgotPassword: RequestHandler = async (req, res, next) => {
  const { value, error } =
    staff_validator.forgot_password_validate_schema.validate({
      email: req.body?.email,
    });

  if (error) {
    return response.responseErrorMessage(res, 400, {
      error: error.details[0].message,
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

    const access_token: string = token.resetPasswordToken({
      payload: { email: staff.email },
      secretKey: dotenvconfig.JWT_ACCESS,
      expiresIn: "15m",
    });

    const email_body: common_type.IEmailBody =
      email_template.resetAccountPasswordEmailTemplate({
        receiver_email: staff.email,
        receiver_name: staff.name,
        access_token,
      });

    const message: string = `Email has beens sent to ${value.email}, please check your email and follow the instructions to reset your password`;

    return mailer.sendEmail(res, email_body, message);
  } catch (e) {
    return next(e);
  }
};

export const postVerifyStaffEmail: RequestHandler = async (req, res, next) => {
  const { value, error } =
    staff_validator.verify_staff_email_validate_schema.validate({
      email: req.body?.email,
      new_email: req.body?.new_email,
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
        error: "Account not found!",
      });
    }

    const is_staff_exists: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "email",
        value: value.new_email,
      });

    if (is_staff_exists) {
      return response.responseErrorMessage(res, 409, {
        error:
          "Account already exists with new email! please try again using another one",
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
        receiver_name: staff.name,
        access_token,
        account: "staff",
      });

    const message: string = `Email has been sent to ${value.email}, please check your email and follow the instructions to update your email`;

    return mailer.sendEmail(res, email_body, message);
  } catch (e) {
    return next(e);
  }
};
