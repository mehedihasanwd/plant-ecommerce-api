import { RequestHandler } from "express";
import { staff_service, redis_service, aws_s3 } from "../../services";
import { response, isValidParamId, create_cache_key } from "../../utils";
import { staff_type } from "../../types";

export const deleteStaffById: RequestHandler = async (req, res, next) => {
  const _id = req.params?.staffId;

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid staff id! please try again using a valid one",
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

    const cache_key: string = create_cache_key.createKeyForDocument({
      key: "staff",
      value: staff._id.toString(),
    });

    if (staff.image.isChangedSelf) {
      await aws_s3.removeImageFromS3({ key: staff.image.key });
    }

    await redis_service.clearKeys({ key: "staffs" });
    await redis_service.removeFromCache({
      key: cache_key,
    });
    await staff_service.removeStaffById({ _id });

    return response.responseSuccessDataAndClearCookie(res, 200, {
      code: 200,
      message: "Deleted successfully",
      links: {
        self: `/staffs/s/${_id}`,
        register: "/register",
      },
    });
  } catch (e) {
    return next(e);
  }
};
