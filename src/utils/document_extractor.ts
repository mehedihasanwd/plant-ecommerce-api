import { staff_type, user_type } from "../types";

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

export const extractUserDocument = ({
  user,
}: {
  user: user_type.THydratedUserDocument;
}): {
  data_except_password: user_type.THydratedUserDocumentExceptPassword;
} => {
  const { password, ...data_except_password } = user.toJSON();

  return { data_except_password };
};
