import express from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { response } from ".";

const minutes: number = 30;

const configLimit = (max: number = 10): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max,
    handler: (
      req: express.Request,
      res: express.Response
    ): express.Response => {
      return response.responseErrorMessage(res, 429, {
        error: `You made too many requests! please try again after ${minutes} minutes`,
      });
    },
  });
};

export const setLimiter = (max: number = 10): RateLimitRequestHandler => {
  return configLimit(max);
};
