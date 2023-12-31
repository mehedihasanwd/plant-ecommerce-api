import { category_type } from "../../types";
import { Category } from "../../models";

export const updateCategoryStatusById = async ({
  _id,
  status,
}: category_type.IUpdateCategoryStatusById): Promise<category_type.THydratedCategoryDocument | null> => {
  const updated_category: category_type.THydratedCategoryDocument | null =
    await Category.findByIdAndUpdate(_id, { $set: { status } }, { new: true });

  if (!updated_category) return null;

  return updated_category.save({ validateModifiedOnly: true });
};

export const updateCategoryById = async ({
  _id,
  data,
}: category_type.IUpdateCategoryById): Promise<category_type.THydratedCategoryDocument | null> => {
  const updated_category: category_type.THydratedCategoryDocument | null =
    await Category.findByIdAndUpdate(_id, { ...data }, { new: true });

  if (!updated_category) return null;

  return updated_category.save({ validateModifiedOnly: true });
};
