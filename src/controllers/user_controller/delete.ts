import { RequestHandler } from "express";
import { user_service, redis_service } from "../../services";
import { response, isValidParamId, create_cache_key } from "../../utils";
import { user_type } from "../../types";

export const deleteUserById: RequestHandler = async (req, res, next) => {
  const _id = req.params?.userId;

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid user id! please try again using a valid one",
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

    const cache_key: string = create_cache_key.createKeyForDocument({
      key: "user",
      value: user._id.toString(),
    });

    await redis_service.clearKeys({ key: "users" });
    await redis_service.removeFromCache({
      key: cache_key,
    });
    await user_service.removeUserById({ _id });

    return response.responseSuccessDataAndClearCookie(res, 200, {
      code: 200,
      message: "Deleted successfully",
      links: {
        self: `/users/u/${_id}`,
        register: "/register",
      },
    });
  } catch (e) {
    return next(e);
  }
};
