import { RequestHandler } from "express";
import { category_service, redis_service, aws_s3 } from "../../services";
import { response, create_cache_key, errorReducer } from "../../utils";
import { category_validator } from "../../validators";
import { common_type, category_type } from "../../types";

export const postNewCategory: RequestHandler = async (req, res, next) => {
  const { value, error } =
    category_validator.post_new_category_validate_schema.validate({
      name: req.body?.name,
      description: req.body?.description,
    });

  const image = req.files?.image as common_type.TUploadedFile;

  if (error) {
    return response.responseErrorMessages(res, 400, {
      errors: errorReducer(error.details),
    });
  }

  try {
    const category: category_type.THydratedCategoryDocument | null =
      await category_service.findCategoryByProp({
        key: "name",
        value: value.name,
      });

    if (category) {
      return response.responseErrorMessage(res, 409, {
        error: "Category already exists! name should be unique",
      });
    }

    const image_error: response.TImageErrorResponse | undefined =
      response.responseImageErrorMessage(res, image);

    if (image_error) return image_error;

    const cloud_image: aws_s3.TS3ManagedUpload | undefined =
      await aws_s3.uploadImageToS3({ image });

    if (!cloud_image) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    const new_category: category_type.THydratedCategoryDocument | null =
      await category_service.createNewCategory({
        data: {
          name: value.name,
          description: value.description,
          image: {
            key: cloud_image.Key,
            url: aws_s3.cloudfrontImageUrl({ cloud_image }),
          },
        },
      });

    if (!new_category) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    // clear categories from cache
    await redis_service.clearKeys({ key: "categories" });

    // save category in cache (3600 * 24 * 2 - for 2 days)
    const cache_key: string = create_cache_key.createKeyForDocument({
      key: "category",
      value: new_category._id.toString(),
    });

    await redis_service.saveToCache({
      key: cache_key,
      document: new_category,
      EX: 3600 * 24 * 2,
    });

    return response.responseSuccessData(res, 201, {
      code: 201,
      message: "Created successfully",
      category: new_category,
      links: {
        self: "/categories",
        categories: "/dashboard/categories",
      },
    });
  } catch (e) {
    return next(e);
  }
};
