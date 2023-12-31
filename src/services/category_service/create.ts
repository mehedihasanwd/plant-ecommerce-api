import { category_type } from "../../types";
import { Category } from "../../models";

export const createNewCategory = async ({
  data,
}: category_type.ICreateNewCategory): Promise<category_type.THydratedCategoryDocument | null> => {
  const new_category: category_type.THydratedCategoryDocument | null =
    new Category({ ...data });

  if (!new_category) return null;

  return new_category.save();
};
