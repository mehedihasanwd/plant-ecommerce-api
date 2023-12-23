import { Staff } from "../../models";
import { staff_type } from "../../types";

export const removeStaffById = async ({
  _id,
}: staff_type.IRemoveStaffById): Promise<staff_type.TRemovedStaffDocument> => {
  return await Staff.findByIdAndDelete(_id);
};
