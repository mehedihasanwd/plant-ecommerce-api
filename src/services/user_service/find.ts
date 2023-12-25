import { User } from "../../models";
import { user_type, common_type } from "../../types";

export const findUserByProp = async ({
  key,
  value,
}: user_type.IFindUserByProp): Promise<user_type.THydratedUserDocument | null> => {
  if (key === "_id") {
    return await User.findById(value);
  }
  return await User.findOne({ [key]: value });
};

export const isMatchUserPassword = async ({
  user,
  password,
}: user_type.IMatchUserPassword): Promise<boolean> => {
  return await user.comparePassword({ password });
};

export const findUsers = async ({
  skip,
  limit,
  sort_type,
  search_by,
}: user_type.IFindUsers): Promise<Array<user_type.THydratedUserDocument> | null> => {
  let users: Array<user_type.THydratedUserDocument> | null = [];

  if (skip && limit) {
    users = await User.aggregate([
      {
        $sort: { _id: sort_type === "asc" ? 1 : -1 },
      },

      {
        $skip: skip,
      },

      { $limit: limit },

      {
        $project: {
          password: 0,
        },
      },
    ]);
  }

  if (!skip && limit) {
    users = await User.aggregate([
      {
        $sort: { _id: sort_type === "asc" ? 1 : -1 },
      },

      { $limit: limit },

      {
        $project: {
          password: 0,
        },
      },
    ]);
  }

  if (skip && limit && search_by) {
    users = await User.aggregate([
      {
        $sort: { _id: sort_type === "asc" ? 1 : -1 },
      },

      {
        $match: {
          $or: [
            { name: { $regex: search_by, $options: "i" } },
            { email: { $regex: search_by, $options: "i" } },
            { phone: { $regex: search_by, $options: "i" } },
          ],
        },
      },

      {
        $skip: skip,
      },

      { $limit: limit },

      {
        $project: {
          password: 0,
        },
      },
    ]);
  }

  if (!skip && limit && search_by) {
    users = await User.aggregate([
      { $sort: { _id: sort_type === "asc" ? 1 : -1 } },

      {
        $match: {
          $or: [
            { name: { $regex: search_by, $options: "i" } },
            { email: { $regex: search_by, $options: "i" } },
            { phone: { $regex: search_by, $options: "i" } },
          ],
        },
      },

      { $limit: limit },

      {
        $project: {
          password: 0,
        },
      },
    ]);
  }

  if (!skip && !limit && !search_by) {
    users = await User.aggregate([
      { $sort: { _id: sort_type === "asc" ? 1 : -1 } },

      {
        $project: {
          password: 0,
        },
      },
    ]);
  }

  if (!users || users.length < 1) return null;

  return users;
};

export const countUsers = async ({
  search_by,
}: common_type.ISearchBy): Promise<number> => {
  const filter = search_by
    ? [
        {
          $or: [
            { name: { $regex: search_by, $options: "i" } },
            { email: { $regex: search_by, $options: "i" } },
            { phone: { $regex: search_by, $options: "i" } },
          ],
        },
      ]
    : {};

  return await User.countDocuments(filter);
};
