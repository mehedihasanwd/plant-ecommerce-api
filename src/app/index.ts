import express from "express";
import swaggerUi from "swagger-ui-express";
import middleware from "./middleware";
import routes from "../routes";
import { response } from "../utils";
import { common_type } from "../types";
import { swaggerspec } from "../../documentation/config/swagger";

const app: express.Application = express();

const globalErrorHandler: express.ErrorRequestHandler = (
  err: common_type.IError,
  req,
  res,
  next
): express.Response => {
  const error: string = err.message || "Something went wrong!";
  const status: number = err.status || 500;
  return response.responseErrorMessage(res, status, { error });
};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerspec));
app.use(middleware);
app.use(routes);
app.use(globalErrorHandler);

export default app;
