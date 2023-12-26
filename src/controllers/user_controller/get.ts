import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { user_service, redis_service } from "../../services";
import {
  response,
  document_extractor,
  create_cache_key,
  pagination,
  isValidParamId,
} from "../../utils";
import { common_type, user_type } from "../../types";
import dotenvconfig from "../../config/dotenvconfig";

export const getUserById: RequestHandler = async (req, res, next) => {
  const _id = req.params?.userId;

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid user id! please try again using a valid one",
    });
  }

  const cache_key: string = create_cache_key.createKeyForDocument({
    key: "user",
    value: _id,
  });

  try {
    const cached_user: string | null = await redis_service.getDocumentFromCache(
      { key: cache_key }
    );

    if (cached_user) {
      const parsed_user: user_type.THydratedUserDocument =
        JSON.parse(cached_user);

      return response.responseSuccessData(res, 200, {
        from_cache: true,
        code: 200,
        user: parsed_user,
        links: {
          self: `/users/u/${_id}`,
          profile: `/users/u/${_id}/profile`,
          users: `/dashboard/users`,
        },
      });
    }

    const user: user_type.THydratedUserDocument | null =
      await user_service.findUserByProp({ key: "_id", value: _id });

    if (!user) {
      return response.responseErrorMessage(res, 404, {
        error: "User not found!",
      });
    }

    const { data_except_password } = document_extractor.extractUserDocument({
      user,
    });

    // save user in cache (3600 * 24 * 2 = for 2 days)
    await redis_service.saveToCache({
      key: cache_key,
      document: data_except_password,
      EX: 3600 * 24 * 2,
    });

    return response.responseSuccessData(res, 200, {
      from_cache: false,
      code: 200,
      user: data_except_password,
      links: {
        self: `/users/u/${_id}`,
        profile: `/users/u/${_id}/profile`,
        users: `/dashboard/users`,
      },
    });
  } catch (e) {
    return next(e);
  }
};
