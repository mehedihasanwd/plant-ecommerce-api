import { category_type, common_type } from "../../types";
import { Category } from "../../models";

export const findCategoryByProp = async ({
  key,
  value,
}: category_type.IFindCategoryByProp): Promise<category_type.THydratedCategoryDocument | null> => {
  if (key === "_id") {
    return await Category.findById(value);
  }

  return await Category.findOne({ [key]: value });
};

export const findCategories = async ({
  skip,
  limit,
  sort_type,
  search_by,
}: category_type.IFindCategories): Promise<Array<category_type.THydratedCategoryDocument> | null> => {
  let categories: Array<category_type.THydratedCategoryDocument> | null = [];

  let status: "active" | "inactive" | "all" = "all";

  let sort_order: "asc" | "dsc" = sort_type === "dsc" ? "dsc" : "asc";

  if (sort_type === "active") {
    status = "active";
  }

  if (sort_type === "inactive") {
    status = "inactive";
  }

  if (skip && limit && search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          $or: [{ name: { $regex: search_by, $options: "i" } }],
          status:
            status === "all"
              ? {
                  $in: ["active", "inactive"],
                }
              : status,
        },
      },

      { $skip: skip },

      { $limit: limit },
    ]);
  }

  if (skip && limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status:
            status === "all"
              ? {
                  $in: ["active", "inactive"],
                }
              : status,
        },
      },

      { $skip: skip },

      { $limit: limit },
    ]);
  }

  if (!skip && limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status: status === "all" ? { $in: ["active", "inactive"] } : status,
        },
      },

      { $limit: limit },
    ]);
  }

  if (skip && !limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status: status === "all" ? { $in: ["active", "inactive"] } : status,
        },
      },

      { $skip: skip },
    ]);
  }

  if (skip && !limit && search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          $or: [{ name: { $regex: search_by, $options: "i" } }],
          status:
            status === "all"
              ? {
                  $in: ["active", "inactive"],
                }
              : status,
        },
      },

      { $skip: skip },
    ]);
  }

  if (!skip && limit && search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          $or: [{ name: { $regex: search_by, $options: "i" } }],
          status:
            status === "all"
              ? {
                  $in: ["active", "inactive"],
                }
              : status,
        },
      },

      { $limit: limit },
    ]);
  }

  if (!skip && !limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status:
            status === "all"
              ? {
                  $in: ["active", "inactive"],
                }
              : status,
        },
      },
    ]);
  }

  if (!skip && !limit && search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          name: { $regex: search_by, $options: "i" },
          status:
            status === "all"
              ? {
                  $in: ["active", "inactive"],
                }
              : status,
        },
      },
    ]);
  }

  if (!skip && !limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_order === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status:
            status === "all"
              ? {
                  $in: ["active", "inactive"],
                }
              : status,
        },
      },
    ]);
  }

  if (!categories || categories.length < 1) return null;

  return categories;
};

export const findCategoryByStatus = async ({
  skip,
  limit,
  sort_type,
  status,
  search_by,
}: category_type.IFindCategoriesByStatus): Promise<Array<category_type.THydratedCategoryDocument> | null> => {
  const status_value: "active" | "inactive" =
    status === "inactive" ? "inactive" : "active";

  let categories: Array<category_type.THydratedCategoryDocument> | null = [];

  if (skip && limit && search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_type === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          name: { $regex: search_by, $options: "i" },
          status: status_value,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limit,
      },
    ]);
  }

  if (!skip && !limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_type === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status: status_value,
        },
      },
    ]);
  }

  if (skip && !limit && search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_type === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          name: { $regex: search_by, $options: "i" },
          status: status_value,
        },
      },

      {
        $skip: skip,
      },
    ]);
  }

  if (skip && !limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_type === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status: status_value,
        },
      },

      { $skip: skip },
    ]);
  }

  if (skip && limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_type === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status: status_value,
        },
      },

      { $skip: skip },

      { $limit: limit },
    ]);
  }

  if (!skip && limit && !search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_type === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          status: status_value,
        },
      },

      { $limit: limit },
    ]);
  }

  if (!skip && limit && search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_type === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          name: { $regex: search_by, $options: "i" },
          status: status_value,
        },
      },

      {
        $limit: limit,
      },
    ]);
  }

  if (!skip && !limit && search_by) {
    categories = await Category.aggregate([
      {
        $sort: {
          _id: sort_type === "asc" ? 1 : -1,
        },
      },

      {
        $match: {
          $or: [{ name: { $regex: search_by, $options: "i" } }],
          status: status_value,
        },
      },
    ]);
  }

  if (!categories || categories.length < 1) return null;

  return categories;
};

export const countCategories = async ({
  search_by,
}: common_type.ISearchBy): Promise<number> => {
  const filter = search_by
    ? {
        name: { $regex: search_by, $options: "i" },
      }
    : {};

  return Category.countDocuments(filter);
};
