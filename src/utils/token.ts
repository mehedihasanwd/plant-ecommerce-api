import jwt from "jsonwebtoken";
import { common_type } from "../types";

interface ISecretKeyExpiresIn {
  secretKey: string;
  expiresIn: string;
}

interface IRegisteAccountToken extends ISecretKeyExpiresIn {
  payload: common_type.IVerifyNewEmail;
}

interface IResetPassswordToken extends ISecretKeyExpiresIn {
  payload: common_type.IEmail;
}

interface IUpdateAccountEmailToken extends ISecretKeyExpiresIn {
  payload: common_type.IVerifyAccountEmail;
}

export const registerAccountToken = ({
  payload,
  secretKey,
  expiresIn,
}: IRegisteAccountToken): string => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const resetPasswordToken = ({
  payload,
  secretKey,
  expiresIn,
}: IResetPassswordToken): string => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const updateAccountEmailToken = ({
  payload,
  secretKey,
  expiresIn,
}: IUpdateAccountEmailToken): string => {
  return jwt.sign(payload, secretKey, { expiresIn });
};
