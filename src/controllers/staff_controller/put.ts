import { RequestHandler } from "express";
import { staff_service, redis_service, aws_s3 } from "../../services";
import { staff_validator } from "../../validators";
import {
  response,
  errorReducer,
  document_extractor,
  create_cache_key,
  isValidParamId,
} from "../../utils";
import { common_type, staff_type } from "../../types";

export const putUpdateStaffById: RequestHandler = async (req, res, next) => {
  const _id = req.params?.staffId as string;
  const image = req.files?.image as common_type.TUploadedFile;
  const { value, error } = staff_validator.update_staff_by_id.validate(
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
      error: "Invalid staff id! please try again using a valid one",
    });
  }

  if (error) {
    return response.responseErrorMessages(res, 400, {
      errors: errorReducer(error.details),
    });
  }

  try {
    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({ key: "_id", value: _id });

    if (!staff) {
      return response.responseErrorMessage(res, 404, {
        error: "Staff not found!",
      });
    }

    const data_to_update: common_type.IUpdateAccount = {
      image: {
        isChangedSelf: staff.image.isChangedSelf,
        key: staff.image.key,
        url: staff.image.url,
      },

      name: value.name,

      gender: value?.gender || staff.gender,

      phone: value?.phone || staff.phone,

      country: value?.country || staff.country,

      city: value?.city || staff.city,

      house_number_or_name:
        value?.house_number_or_name || staff?.house_number_or_name,

      post_code: value?.post_code || staff.post_code,
    };

    if (image) {
      const image_error: response.TImageErrorResponse | undefined =
        response.responseImageErrorMessage(res, image);

      if (image_error) return image_error;

      if (staff.image.isChangedSelf) {
        await aws_s3.removeImageFromS3({ key: staff.image.key });
      }

      const cloud_image: aws_s3.TS3ManagedUpload | undefined =
        await aws_s3.uploadImageToS3({ image });

      if (!cloud_image) {
        return response.responseErrorMessage(res, 500, {
          error: "Server error occurred! please try again",
        });
      }

      const updated_staff: staff_type.THydratedStaffDocument | null =
        await staff_service.updateStaffById({
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

      if (!updated_staff) {
        return response.responseErrorMessage(res, 500, {
          error: "Server error occurred! please try again",
        });
      }

      const { data_except_password } = document_extractor.extractStaffDocument({
        staff: updated_staff,
      });

      const { access_token, refresh_token } =
        await staff_service.createStaffAuthTokens({
          staff: updated_staff,
        });

      // clear staffs from cache
      await redis_service.clearKeys({ key: "staffs" });

      // save staff in cache: 3600 * 24 * 2 - for 2 days
      const cache_key: string = create_cache_key.createKeyForDocument({
        key: "staff",
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
          staff: data_except_password,
          links: {
            self: `/staffs/s/${data_except_password._id}`,
            profile: `/staffs/s/${data_except_password._id}/profile`,
          },
        }
      );
    }

    const updated_staff: staff_type.THydratedStaffDocument | null =
      await staff_service.updateStaffById({ _id, data: data_to_update });

    if (!updated_staff) {
      return response.responseErrorMessage(res, 500, {
        error: "Server error occurred! please try again",
      });
    }

    const { data_except_password } = document_extractor.extractStaffDocument({
      staff: updated_staff,
    });

    const { access_token, refresh_token } =
      await staff_service.createStaffAuthTokens({
        staff: updated_staff,
      });

    // clear staffs from cache
    await redis_service.clearKeys({ key: "staffs" });

    // save staff in cache: 3600 * 24 * 2 - for 2 days
    const cache_key: string = create_cache_key.createKeyForDocument({
      key: "staff",
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
      staff: data_except_password,
      links: {
        self: `/staffs/s/${data_except_password._id}`,
        profile: `/staffs/s/${data_except_password._id}/profile`,
      },
    });
  } catch (e) {
    return next(e);
  }
};
