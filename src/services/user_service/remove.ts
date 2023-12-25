import { User } from "../../models";
import { user_type } from "../../types";

export const removeUserById = async ({
  _id,
}: user_type.IRemoveUserById): Promise<user_type.TRemovedUserDocument> => {
  return await User.findByIdAndDelete(_id);
};
