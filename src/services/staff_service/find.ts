import { Staff } from "../../models";
import { staff_type, common_type } from "../../types";

export const findStaffByProp = async ({
  key,
  value,
}: staff_type.IFindStaffByProp): Promise<staff_type.THydratedStaffDocument | null> => {
  if (key === "_id") {
    return await Staff.findById(value);
  }
  return await Staff.findOne({ [key]: value });
};

export const isMatchStaffPassword = async ({
  staff,
  password,
}: staff_type.IMatchStaffPassword): Promise<boolean> => {
  return await staff.comparePassword({ password });
};

export const findStaffs = async ({
  skip,
  limit,
  sort_type,
  search_by,
}: staff_type.IFindStaffs): Promise<Array<staff_type.THydratedStaffDocument> | null> => {
  let staffs: Array<staff_type.THydratedStaffDocument> | null = [];

  if (skip && limit) {
    staffs = await Staff.aggregate([
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
    staffs = await Staff.aggregate([
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
    staffs = await Staff.aggregate([
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
    staffs = await Staff.aggregate([
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
    staffs = await Staff.aggregate([
      { $sort: { _id: sort_type === "asc" ? 1 : -1 } },

      {
        $project: {
          password: 0,
        },
      },
    ]);
  }

  if (!staffs || staffs.length < 1) return null;

  return staffs;
};

export const countStaffs = async ({
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

  return await Staff.countDocuments(filter);
};
