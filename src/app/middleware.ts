import express from "express";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import dotenvconfig from "../config/dotenvconfig";
import { setLimiter } from "../utils";

const environments: {
  development: "development";
  production: "production";
} = { development: "development", production: "production" };

const middleware = [
  express.json(),
  express.urlencoded({ extended: false }),
  fileUpload(),
  cookieParser(),
  setLimiter(200),
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
  helmet(),
  morgan("dev"),
];

if (dotenvconfig.NODE_ENV === environments.production) {
  middleware.pop();
}

export default middleware;
