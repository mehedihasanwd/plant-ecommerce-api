import { staff_type } from "../types";

export const extractStaffDocument = ({
  staff,
}: {
  staff: staff_type.THydratedStaffDocument;
}): {
  data_except_password: staff_type.THydratedStaffDocumentExceptPassword;
} => {
  const { password, ...data_except_password } = staff.toJSON();

  return { data_except_password };
};
