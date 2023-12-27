import { User } from "../../models";
import { user_type } from "../../types";

export const updateUserById = async ({
  _id,
  data,
}: user_type.IUpdateUserById): Promise<user_type.THydratedUserDocument | null> => {
  const updated_user: user_type.THydratedUserDocument | null =
    await User.findByIdAndUpdate(
      _id,

      {
        $set: { ...data },
      },

      { new: true }
    );

  if (!updated_user) return null;

  return updated_user.save({ validateModifiedOnly: true });
};

export const updateUserPassword = async ({
  user,
  new_password,
}: user_type.IUpdateUserPassword): Promise<user_type.THydratedUserDocument | null> => {
  user.password = new_password;
  return user.save({ validateModifiedOnly: true });
};

export const updateUserEmail = async ({
  user,
  new_email,
}: user_type.IUpdateUserEmail): Promise<user_type.THydratedUserDocument | null> => {
  user.email = new_email;
  return user.save({ validateModifiedOnly: true });
};
