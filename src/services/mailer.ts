import express from "express";
import nodemailer from "nodemailer";
import dotenvconfig from "../config/dotenvconfig";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { response } from "../utils";
import { common_type } from "../types";

const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport({
    host: dotenvconfig.EMAIL_HOST,
    port: dotenvconfig.EMAIL_PORT,
    service: dotenvconfig.EMAIL_SERVICE,
    secure: false,
    auth: {
      user: dotenvconfig.EMAIL_USER,
      pass: dotenvconfig.EMAIL_PASS,
    },
  });

export const sendEmail = (
  res: express.Response,
  body: common_type.IEmailBody,
  message: string
) => {
  transporter.verify((err: Error | null) => {
    if (err) {
      return response.responseErrorMessage(res, 403, {
        error: `Something went wrong while verifying email: ${err.message}`,
      });
    } else {
      console.log("Server is ready to take our email (mailter.ts)");
    }
  });

  transporter.sendMail(body, (err: Error | null) => {
    if (err) {
      return response.responseErrorMessage(res, 403, {
        error: `Something went wrong while sending email: ${err.message}`,
      });
    } else {
      return response.responseSuccessMessage(res, 200, { message });
    }
  });
};

export const sendEmailToSuperAdmin = (
  res: express.Response,
  body: common_type.IEmailBody,
  message: string
) => {
  transporter.verify((err: Error | null) => {
    if (err) {
      console.log(
        `(mailter.ts): Something went wrong while verifying email: ${err.message}`
      );
    } else {
      console.log("(mailer.ts): Server is ready to take our email");
    }
  });

  transporter.sendMail(body, (err: Error | null) => {
    if (err) {
      console.log(
        `(mailter.ts): Something went wrong while sending email: ${err.message}`
      );
    }
  });
};
