import dotenvconfig from "../../config/dotenvconfig";
import { User } from "../../models";
import { user_type, payload_type, common_type } from "../../types";

export const createNewUser = async ({
  data,
}: user_type.ICreateNewUser): Promise<user_type.THydratedUserDocument | null> => {
  const new_user: user_type.THydratedUserDocument | null = new User({
    ...data,
  });

  if (!new_user) return null;

  return new_user.save();
};

export const createUserAuthTokens = async ({
  user,
}: user_type.ICreateUserAuthTokens): Promise<user_type.IUserAuthTokens> => {
  const access_token_payload: payload_type.IUserPayload = {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const refresh_token_payload: common_type.IObjectId | string = {
    _id: user._id,
  };

  const access_token: string = await user.createAccessToken({
    payload: access_token_payload,
    secretKey: dotenvconfig.JWT_ACCESS,
    expiresIn: "3h",
  });

  const refresh_token: string = await user.createRefreshToken({
    payload: refresh_token_payload,
    secretKey: dotenvconfig.JWT_REFRESH,
    expiresIn: "7d",
  });

  return { access_token, refresh_token };
};
