import { RequestHandler } from "express";
import { user_service, redis_service, aws_s3 } from "../../services";
import { user_validator } from "../../validators";
import {
  response,
  errorReducer,
  document_extractor,
  create_cache_key,
  isValidParamId,
} from "../../utils";
import { common_type, user_type } from "../../types";

export const putUpdateUserById: RequestHandler = async (req, res, next) => {
  const _id = req.params?.userId as string;
  const image = req.files?.image as common_type.TUploadedFile;
  const { value, error } = user_validator.update_user_by_id.validate(
    {
      name: req.body?.name,
      gender: req.body?.gender,
      phone: req.body?.phone,
      country: req.body?.country,
      city: req.body?.city,
      house_number_or_name: req.body?.house_number_or_name,
      post_code: req.body?.post_code,
    },
    { abortEarly: false }
  );

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid user id! please try again using a valid one",
    });
  }

  if (error) {
    return response.responseErrorMessages(res, 400, {
      errors: errorReducer(error.details),
    });
  }

  try {
    const user: user_type.THydratedUserDocument | null =
      await user_service.findUserByProp({ key: "_id", value: _id });

    if (!user) {
      return response.responseErrorMessage(res, 404, {
        error: "User not found!",
      });
    }

    const data_to_update: common_type.IUpdateAccount = {
      image: {
        isChangedSelf: user.image.isChangedSelf,
        key: user.image.key,
        url: user.image.url,
      },

      name: value.name,

      gender: value.gender,

      phone: value.phone,

      country: value.country,

      city: value.city,

      house_number_or_name: value.house_number_or_name,

      post_code: value.post_code,
    };

    if (image) {
      const image_error: response.TImageErrorResponse | undefined =
        response.responseImageErrorMessage(res, image);

      if (image_error) return image_error;

      if (user.image.isChangedSelf) {
        await aws_s3.removeImageFromS3({ key: user.image.key });
      }

      const cloud_image: aws_s3.TS3ManagedUpload | undefined =
        await aws_s3.uploadImageToS3({ image });

      if (!cloud_image) {
        return response.responseErrorMessage(res, 500, {
          error: "Server error occurred! please try again",
        });
      }

      const updated_user: user_type.THydratedUserDocument | null =
        await user_service.updateUserById({
          _id,
          data: {
            ...data_to_update,
            image: {
              isChangedSelf: true,
              key: cloud_image.Key,
              url: aws_s3.cloudfrontImageUrl({ cloud_image }),
            },
          },
        });

      if (!updated_user) {
        return response.responseErrorMessage(res, 500, {
          error: "Server error occurred! please try again",
        });
      }

      const { data_except_password } = document_extractor.extractUserDocument({
        user: updated_user,
      });

      const { access_token, refresh_token } =
        await user_service.createUserAuthTokens({
          user: updated_user,
        });

      // clear users from cache
      await redis_service.clearKeys({ key: "users" });

      // save user in cache: 3600 * 24 * 2 - for 2 days
      const cache_key: string = create_cache_key.createKeyForDocument({
        key: "user",
        value: data_except_password._id.toString(),
      });

      await redis_service.saveToCache({
        key: cache_key,
        document: data_except_password,
        EX: 3600 * 24 * 2,
      });

      return response.responseSuccessDataAndSaveCookie(
        res,
        refresh_token,
        200,
        {
          code: 200,
          message: "Information updated successfully",
          access_token,
          user: data_except_password,
          links: {
            self: `/users/u/${data_except_password._id}`,
            profile: `/users/u/${data_except_password._id}/profile`,
          },
        }
      );
    }

    const updated_user: user_type.THydratedUserDocument | null =
      await user_service.updateUserById({ _id, data: data_to_update });

    if (!updated_user) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    const { data_except_password } = document_extractor.extractUserDocument({
      user: updated_user,
    });

    const { access_token, refresh_token } =
      await user_service.createUserAuthTokens({
        user: updated_user,
      });

    // clear users from cache
    await redis_service.clearKeys({ key: "users" });

    // save user in cache: 3600 * 24 * 2 - for 2 days
    const cache_key: string = create_cache_key.createKeyForDocument({
      key: "user",
      value: data_except_password._id.toString(),
    });

    await redis_service.saveToCache({
      key: cache_key,
      document: data_except_password,
      EX: 3600 * 24 * 2,
    });

    return response.responseSuccessDataAndSaveCookie(res, refresh_token, 200, {
      code: 200,
      message: "Information updated successfully",
      access_token,
      user: data_except_password,
      links: {
        self: `/users/u/${data_except_password._id}`,
        profile: `/users/u/${data_except_password._id}/profile`,
      },
    });
  } catch (e) {
    return next(e);
  }
};
