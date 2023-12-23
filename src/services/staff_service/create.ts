import dotenvconfig from "../../config/dotenvconfig";
import { Staff } from "../../models";
import { staff_type, payload_type, common_type } from "../../types";

export const createNewStaff = async ({
  data,
}: staff_type.ICreateNewStaff): Promise<staff_type.THydratedStaffDocument | null> => {
  const new_staff: staff_type.THydratedStaffDocument | null = new Staff({
    ...data,
  });

  if (!new_staff) return null;

  return new_staff.save();
};

export const createStaffAuthTokenTokens = async ({
  staff,
}: staff_type.ICreateStaffAuthTokens): Promise<staff_type.IStaffAuthTokens> => {
  const access_token_payload: payload_type.IStaffPayload = {
    _id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
  };

  const refresh_token_payload: common_type.IObjectId | string = {
    _id: staff._id,
  };

  const access_token: string = await staff.createAccessToken({
    payload: access_token_payload,
    secretKey: dotenvconfig.JWT_ACCESS,
    expiresIn: "3h",
  });

  const refresh_token: string = await staff.createRefreshToken({
    payload: refresh_token_payload,
    secretKey: dotenvconfig.JWT_REFRESH,
    expiresIn: "7d",
  });

  return { access_token, refresh_token };
};
