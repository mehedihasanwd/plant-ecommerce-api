import mongoose from "mongoose";
import { category_type } from "../types";

const category_schema = new mongoose.Schema<
  category_type.ICategorySchema,
  category_type.ICategoryModel
>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 80,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: {
        key: {
          type: String,
          required: true,
        },

        url: {
          type: String,
          required: true,
        },
      },

      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

category_schema.index({ name: 1, slug: 1, status: 1 });

export const Category: category_type.ICategoryModel = mongoose.model<
  category_type.ICategorySchema,
  category_type.ICategoryModel
>("Category", category_schema);
