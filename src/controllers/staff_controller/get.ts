import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { staff_service, mailer } from "../../services";
import { staff_validator } from "../../validators";
import {
  response,
  errorReducer,
  token,
  email_template,
  document_extractor,
} from "../../utils";
import { common_type, staff_type } from "../../types";
import dotenvconfig from "../../config/dotenvconfig";

export const getStaffs: RequestHandler = async (req, res, next) => {
  try {
  } catch (e) {
    return next(e);
  }
};

export const getNewAccessToken: RequestHandler = async (req, res, next) => {
  const refresh_token = req.cookies?.refresh_token as string;

  if (!refresh_token) {
    return response.responseErrorMessage(res, 401, { error: "Unautorized!" });
  }

  try {
    jwt.verify(
      refresh_token,
      dotenvconfig.JWT_REFRESH,
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

        const payload = decoded as common_type.IObjectId;

        const staff: staff_type.THydratedStaffDocument | null =
          await staff_service.findStaffByProp({
            key: "_id",
            value: payload._id.toString(),
          });

        if (!staff) {
          return response.responseErrorMessage(res, 404, {
            error: "Staff not found!",
          });
        }

        const { access_token } = await staff_service.createStaffAuthTokenTokens(
          { staff }
        );

        return response.responseSuccessData(res, 200, {
          code: 200,

          access_token,

          links: {
            self: "/auth/staffs/access-token",
          },
        });
      }
    );
  } catch (e) {
    return next(e);
  }
};
