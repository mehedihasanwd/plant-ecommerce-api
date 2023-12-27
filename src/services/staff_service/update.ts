import { Staff } from "../../models";
import { staff_type } from "../../types";

export const updateStaffById = async ({
  _id,
  data,
}: staff_type.IUpdateStaffById): Promise<staff_type.THydratedStaffDocument | null> => {
  const updated_staff: staff_type.THydratedStaffDocument | null =
    await Staff.findByIdAndUpdate(
      _id,

      {
        $set: { ...data },
      },

      { new: true }
    );

  if (!updated_staff) return null;

  return updated_staff.save({ validateModifiedOnly: true });
};

export const updateStaffRoleById = async ({
  _id,
  role,
}: staff_type.IUpdateStaffRoleById): Promise<staff_type.THydratedStaffDocument | null> => {
  const updated_staff: staff_type.THydratedStaffDocument | null =
    await Staff.findByIdAndUpdate(
      _id,

      {
        $set: { role },
      },

      { new: true }
    );

  if (!updated_staff) return null;

  return updated_staff.save({ validateModifiedOnly: true });
};

export const updateStaffPassword = async ({
  staff,
  new_password,
}: staff_type.IUpdateStaffPassword): Promise<staff_type.THydratedStaffDocument | null> => {
  staff.password = new_password;
  return staff.save({ validateModifiedOnly: true });
};

export const updateStaffEmail = async ({
  staff,
  new_email,
}: staff_type.IUpdateStaffEmail): Promise<staff_type.THydratedStaffDocument | null> => {
  staff.email = new_email;

  return staff.save({ validateModifiedOnly: true });
};
