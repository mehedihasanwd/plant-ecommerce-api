import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { staff_service, redis_service } from "../../services";
import {
  response,
  document_extractor,
  create_cache_key,
  pagination,
  isValidParamId,
} from "../../utils";
import { common_type, staff_type } from "../../types";
import dotenvconfig from "../../config/dotenvconfig";

export const getStaffs: RequestHandler = async (req, res, next) => {
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
    key: "staffs",
    page: current_page,
    limit,
    skip,
    sort_type: sort_type,
    search_by,
  });

  try {
    const cached_staffs: string | null =
      await redis_service.getDocumentFromCache({
        key: cache_key,
      });

    if (cached_staffs) {
      const parsed_staffs: Array<staff_type.THydratedStaffDocumentExceptPassword> =
        JSON.parse(cached_staffs);

      const total_staffs: number = await staff_service.countStaffs({
        search_by,
      });

      const total_pages: number = Math.ceil(total_staffs / limit);
      const next_page: number | null =
        current_page < total_pages ? current_page + 1 : null;

      const get_pagination = pagination.getPagination({
        collection: "staffs",
        current_page,
        total_items: total_staffs,
        total_pages,
        limit,
        prev_page,
        next_page,
      });

      const get_links = pagination.getPaginationLinks({
        collection: "staffs",
        current_page,
        prev_page,
        next_page,
        limit,
      });

      return response.responseSuccessData(res, 200, {
        from_cache: true,
        code: 200,
        staffs: parsed_staffs,
        pagination: get_pagination,
        links: get_links,
      });
    }

    const staffs: Array<staff_type.THydratedStaffDocumentExceptPassword> | null =
      await staff_service.findStaffs({ skip, limit, sort_type, search_by });

    if (!staffs) {
      return response.responseErrorMessage(res, 404, {
        error: "Staffs not found!",
      });
    }

    // save staffs in cache (3600 * 24 * 2 - for 2 days)
    await redis_service.saveToCache({
      key: cache_key,
      document: staffs,
      EX: 3600 * 24 * 2,
    });

    const total_staffs: number = await staff_service.countStaffs({ search_by });

    const total_pages: number = Math.ceil(total_staffs / limit);
    const next_page: number | null =
      current_page < total_pages ? current_page + 1 : null;

    const get_pagination = pagination.getPagination({
      collection: "staffs",
      current_page,
      total_items: total_staffs,
      total_pages,
      limit,
      prev_page,
      next_page,
    });

    const get_links = pagination.getPaginationLinks({
      collection: "staffs",
      current_page,
      prev_page,
      next_page,
      limit,
    });

    return response.responseSuccessData(res, 200, {
      from_cache: false,
      code: 200,
      staffs,
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

        const { access_token } = await staff_service.createStaffAuthTokens({
          staff,
        });

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

export const getStaffById: RequestHandler = async (req, res, next) => {
  const _id = req.params?.staffId;

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid staff id! please try again using a valid one",
    });
  }

  const cache_key: string = create_cache_key.createKeyForDocument({
    key: "staff",
    value: _id,
  });

  try {
    const cached_staff: string | null =
      await redis_service.getDocumentFromCache({ key: cache_key });

    if (cached_staff) {
      const parsed_staff: staff_type.THydratedStaffDocument =
        JSON.parse(cached_staff);

      return response.responseSuccessData(res, 200, {
        from_cache: true,
        code: 200,
        staff: parsed_staff,
        links: {
          self: `/staffs/s/${_id}`,
          profile: `/staffs/s/${_id}/profile`,
          staffs: `/dashboard/staffs`,
        },
      });
    }

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({ key: "_id", value: _id });

    if (!staff) {
      return response.responseErrorMessage(res, 404, {
        error: "Staff not found!",
      });
    }

    const { data_except_password } = document_extractor.extractStaffDocument({
      staff,
    });

    // save staff in cache (3600 * 24 * 2 = for 2 days)
    await redis_service.saveToCache({
      key: cache_key,
      document: data_except_password,
      EX: 3600 * 24 * 2,
    });

    return response.responseSuccessData(res, 200, {
      from_cache: false,
      code: 200,
      staff: data_except_password,
      links: {
        self: `/staffs/s/${_id}`,
        profile: `/staffs/s/${_id}/profile`,
        staffs: `/dashboard/staffs`,
      },
    });
  } catch (e) {
    return next(e);
  }
};
