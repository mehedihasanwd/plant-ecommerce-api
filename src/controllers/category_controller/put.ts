import { RequestHandler } from "express";
import { redis_service, category_service, aws_s3 } from "../../services";
import { common_type, category_type } from "../../types";
import {
  response,
  isValidParamId,
  errorReducer,
  string_converter,
  create_cache_key,
  cache_expiration,
} from "../../utils";
import { category_validator } from "../../validators";

export const putUpdateCategoryById: RequestHandler = async (req, res, next) => {
  const _id: string = req.params?.categoryId as string;
  const image = req.files?.image as common_type.TUploadedFile;
  const { value, error } =
    category_validator.put_category_validate_schema.validate(
      { name: req.body?.name, description: req.body?.description },
      { abortEarly: false }
    );

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid category id! please try again using a valid one",
    });
  }

  if (error) {
    return response.responseErrorMessages(res, 400, {
      errors: errorReducer(error.details),
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

    const data_to_update: {
      name: common_type.TCategory;
      slug: string;
      description: string;
      image: common_type.ImageProps;
    } = {
      name: value.name,
      slug: string_converter.convertStringToUrl(value.name),
      description: value.description,
      image: {
        key: category.image.key,
        url: category.image.url,
      },
    };

    if (image) {
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

      await aws_s3.removeImageFromS3({ key: category.image.key });

      const updated_category: category_type.THydratedCategoryDocument | null =
        await category_service.updateCategoryById({
          _id,
          data: {
            ...data_to_update,
            image: {
              key: cloud_image.Key,
              url: aws_s3.cloudfrontImageUrl({ cloud_image }),
            },
          },
        });

      if (!updated_category) {
        return response.responseErrorMessage(res, 500, {
          error: "Server error occurred! please try again",
        });
      }

      // clear categories from cache
      await redis_service.clearKeys({ key: "categories" });

      // save category in cache (for 2 days)
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
        message: "Updated successfully",
        category: updated_category,
        links: {
          self: `/categories/ca/${_id}`,
          categories: "/categories",
        },
      });
    }

    const updated_category: category_type.THydratedCategoryDocument | null =
      await category_service.updateCategoryById({ _id, data: data_to_update });

    if (!updated_category) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    // clear categories from cache
    await redis_service.clearKeys({ key: "categories" });

    // save category in cache (for 2 days)
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
      message: "Updated successfully",
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
