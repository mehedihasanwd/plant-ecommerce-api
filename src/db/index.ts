import mongoose from "mongoose";

export const connectDatabase = (
  uri: string
): Promise<typeof import("mongoose")> => {
  return mongoose.connect(uri);
};
