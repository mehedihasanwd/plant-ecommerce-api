import { RequestHandler } from "express";
import { redis_service, category_service, aws_s3 } from ".././../services";
import {
  create_cache_key,
  isValidParamId,
  response,
  collection_keys,
} from ".././../utils";
import { category_type } from ".././../types";

export const deleteCategoryById: RequestHandler = async (req, res, next) => {
  const _id = req.params?.categoryId;

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid category id! please try again using a valid one",
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

    // clear categories and category from cache
    const cache_key: string = create_cache_key.createKeyForDocument({
      key: "category",
      value: category._id.toString(),
    });

    await redis_service.removeFromCache({
      key: [collection_keys.categories, cache_key],
    });

    await aws_s3.removeImageFromS3({ key: category.image.key });

    await category_service.removeCategoryById({ _id });

    return response.responseSuccessData(res, 200, {
      code: 200,
      message: "Deleted successfully",
      links: {
        self: `/categories/ca/${_id}`,
        categories: "/categories",
      },
    });
  } catch (e) {
    return next(e);
  }
};
