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

export const getUsers: RequestHandler = async (req, res, next) => {
  const current_page: number = Number(req.query?.page || "1");
  const limit: number = Number(req.query?.limit || "12");
  const skip: number = (current_page - 1) * limit;
  const prev_page: number | null = current_page > 1 ? current_page - 1 : null;
  const sort_type: "asc" | "dsc" =
    req.query?.sort_type === "dsc" ? "dsc" : "asc";
  const search_by: string | undefined = req.query?.search_by
    ? String(req.query?.search_by)
    : undefined;

  const cache_key: string = create_cache_key.createKeyForCollection({
    key: "users",
    page: current_page,
    limit,
    skip,
    sort_type,
    search_by,
  });

  try {
    const cached_users: string | null =
      await redis_service.getDocumentFromCache({
        key: cache_key,
      });

    if (cached_users) {
      const parsed_users: Array<user_type.THydratedUserDocumentExceptPassword> =
        JSON.parse(cached_users);

      const total_users: number = await user_service.countUsers({
        search_by,
      });

      const total_pages: number = Math.ceil(total_users / limit);
      const next_page: number | null =
        current_page < total_pages ? current_page + 1 : null;

      const get_pagination = pagination.getPagination({
        collection: "users",
        current_page,
        total_items: total_users,
        total_pages,
        limit,
        prev_page,
        next_page,
      });

      const get_links = pagination.getPaginationLinks({
        collection: "users",
        current_page,
        prev_page,
        next_page,
        limit,
      });

      return response.responseSuccessData(res, 200, {
        from_cache: true,
        code: 200,
        users: parsed_users,
        pagination: get_pagination,
        links: get_links,
      });
    }

    const users: Array<user_type.THydratedUserDocumentExceptPassword> | null =
      await user_service.findUsers({ skip, limit, sort_type, search_by });

    if (!users) {
      return response.responseErrorMessage(res, 404, {
        error: "Users not found!",
      });
    }

    // save users in cache (3600 * 24 * 2 - for 2 days)
    await redis_service.saveToCache({
      key: cache_key,
      document: users,
      EX: 3600 * 24 * 2,
    });

    const total_users: number = await user_service.countUsers({ search_by });

    const total_pages: number = Math.ceil(total_users / limit);
    const next_page: number | null =
      current_page < total_pages ? current_page + 1 : null;

    const get_pagination = pagination.getPagination({
      collection: "users",
      current_page,
      total_items: total_users,
      total_pages,
      limit,
      prev_page,
      next_page,
    });

    const get_links = pagination.getPaginationLinks({
      collection: "users",
      current_page,
      prev_page,
      next_page,
      limit,
    });

    return response.responseSuccessData(res, 200, {
      from_cache: false,
      code: 200,
      users,
      pagination: get_pagination,
      links: get_links,
    });
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

        const user: user_type.THydratedUserDocument | null =
          await user_service.findUserByProp({
            key: "_id",
            value: payload._id.toString(),
          });

        if (!user) {
          return response.responseErrorMessage(res, 404, {
            error: "User not found!",
          });
        }

        const { access_token } = await user_service.createUserAuthTokens({
          user,
        });

        return response.responseSuccessData(res, 200, {
          code: 200,

          access_token,

          links: {
            self: "/auth/users/access-token",
          },
        });
      }
    );
  } catch (e) {
    return next(e);
  }
};
