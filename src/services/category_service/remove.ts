import { category_type, common_type } from "../../types";
import { Category } from "../../models";

export const removeCategoryById = async ({
  _id,
}: common_type.IObjectIdOrString): Promise<category_type.TRemovedCategoryDocument> => {
  return await Category.findByIdAndDelete(_id);
};
