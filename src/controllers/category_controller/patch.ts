import { RequestHandler } from "express";
import { category_service, redis_service } from "../../services";
import { category_type } from "../../types";
import {
  create_cache_key,
  isValidParamId,
  response,
  cache_expiration,
} from "../../utils";
import { category_validator } from "../../validators";

export const patchUpdateCategoryStatusById: RequestHandler = async (
  req,
  res,
  next
) => {
  const _id = req.params?.categoryId;
  const { value, error } =
    category_validator.patch_category_status_validate_schema.validate({
      status: req.body?.status,
    });

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid category id! please try again using a valid one",
    });
  }

  if (error) {
    return response.responseErrorMessage(res, 400, {
      error: error.details[0].message,
    });
  }

  try {
    const category: category_type.THydratedCategoryDocument | null =
      await category_service.findCategoryByProp({ key: "_id", value: _id });

    if (!category) {
      return response.responseErrorMessage(res, 404, {
        error: "Category not found!",
      });
    }

    if (category.status === value.status) {
      return response.responseErrorMessage(res, 409, {
        error: `Status is already ${value.status}`,
      });
    }

    const updated_category: category_type.THydratedCategoryDocument | null =
      await category_service.updateCategoryStatusById({
        _id,
        status: value.status,
      });

    if (!updated_category) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    // clear categories from  cache
    await redis_service.clearKeys({ key: "categories" });

    // save category in cache
    const cache_key: string = create_cache_key.createKeyForDocument({
      key: "category",
      value: updated_category._id.toString(),
    });

    await redis_service.saveToCache({
      key: cache_key,
      document: updated_category,
      EX: cache_expiration.setCacheExpiration({ day: 2 }),
    });

    return response.responseSuccessData(res, 200, {
      code: 200,
      message: "Status updated successfully",
      category: updated_category,
      links: {
        self: `/categories/ca/${_id}`,
        categories: "/categories",
      },
    });
  } catch (e) {
    return next(e);
  }
};
