import { isValidObjectId } from "mongoose";

export const isValidParamId = (_id: string): boolean => {
  return isValidObjectId(_id);
};
