import { Response } from "express";
import { TUploadedFile } from "../types/common_type";

export type TImageErrorResponse = Response<any, Record<string, any>>;

export const responseErrorMessage = (
  res: Response,
  status: number,
  errorObj: { error: string }
): Response => {
  return res.status(status).json(errorObj);
};

export const responseErrorMessages = (
  res: Response,
  status: number,
  errorsObj: { errors: object }
): Response => {
  return res.status(status).json(errorsObj);
};

export const responseSuccessMessage = (
  res: Response,
  status: number,
  messageObj: { message: string }
): Response => {
  return res.status(status).json(messageObj);
};

export const responseImageErrorMessage = (
  res: Response,
  image: TUploadedFile
): TImageErrorResponse | undefined => {
  const fileTypes: string[] = ["image/jpeg", "image/png", "image/jpg"];
  const image_size: number = 1024;

  if (!image) {
    return responseErrorMessage(res, 400, {
      error: "Please upload an image!",
    });
  }

  if (Array.isArray(image)) {
    return responseErrorMessage(res, 400, {
      error: "Multiple image uploads are not allowed!",
    });
  }

  if (!fileTypes.includes(image.mimetype)) {
    return responseErrorMessage(res, 415, {
      error: "Unsupported image format! supported formats: JPG, PNG, JPEG",
    });
  }

  if (image.size / 1024 > image_size) {
    return responseErrorMessage(res, 400, {
      error: `Image should be less than: ${image_size}kb or 1mb`,
    });
  }

  return undefined;
};

export const responseSuccessData = (
  res: Response,
  status: number,
  data: object
): Response => {
  return res.status(status).json(data);
};

// maxAge
const seconds: number = 60;
const minutes: number = 60;
const hours: number = 24;
const days: number = 7;
const maxAge: number = seconds * minutes * hours * days;

export const responseSuccessDataAndSaveCookie = (
  res: Response,
  refresh_token_value: string,
  status: number,
  data: object
): Response => {
  return res
    .cookie("refresh_token", refresh_token_value, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge,
    })
    .status(status)
    .json(data);
};

export const responseSuccessDataAndClearCookie = (
  res: Response,
  status: number,
  data: object
): Response => {
  return res
    .clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    })
    .status(status)
    .json(data);
};
