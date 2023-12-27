import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user_type, document_method } from "../types";
import dotenvconfig from "../config/dotenvconfig";

const user_schema = new mongoose.Schema<
  user_type.IUserSchema,
  user_type.IUserModel,
  document_method.IUserMethods
>(
  {
    name: {
      type: String,
      trim: true,
      minlength: 6,
      required: [true, "Name is required!"],
    },

    email: {
      type: String,
      trim: true,
      required: [true, "E-mail is required!"],
      validate: {
        validator: function (v: string) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          );
        },
      },
    },

    password: {
      type: String,
      trim: true,
      minlength: 8,
      required: [true, "Password is required"],
      validate: {
        validator: function (v: string) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            v
          );
        },
      },
    },

    gender: {
      type: String,
      enum: ["man", "woman", "select"],
      default: "select",
    },

    phone: {
      type: String,
      trim: true,
      minlength: 5,
    },

    image: {
      type: {
        isChangedSelf: {
          type: Boolean,
        },

        key: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          trim: true,
        },
      },

      default: {
        isChangedSelf: false,
        key: dotenvconfig.DEFAULT_PROFILE_IMAGE_KEY,
        url: dotenvconfig.DEFAULT_PROFILE_IMAGE_URL,
      },
    },

    country: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    house_number_or_name: {
      type: String,
      default: "",
    },

    post_code: {
      type: Number,
      default: 1111,
    },

    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
  },
  { timestamps: true }
);

user_schema.methods.comparePassword = async function ({ password }) {
  return await bcrypt.compare(password, this.password);
};

user_schema.methods.createAccessToken = async ({
  payload,
  secretKey,
  expiresIn,
}) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

user_schema.methods.createRefreshToken = async ({
  payload,
  secretKey,
  expiresIn,
}) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

user_schema.pre(
  "save",
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) {
      return next();
    } else {
      const salt: string = await bcrypt.genSalt(14);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    }
  }
);

user_schema.index({ email: 1 });

export const User: user_type.IUserModel = mongoose.model<
  user_type.IUserSchema,
  user_type.IUserModel
>("User", user_schema);
