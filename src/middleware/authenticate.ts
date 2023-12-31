import express, { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenvconfig from "../config/dotenvconfig";
import { payload_type, staff_type, user_type } from "../types";
import { response } from "../utils";
import { staff_service, user_service } from "../services";

interface IAuthAccountRoles {
  admin: "admin";
  editor: "editor";
  guest: "guest";
  user: "user";
}

const auth_account_roles: IAuthAccountRoles = {
  admin: "admin",
  editor: "editor",
  guest: "guest",
  user: "user",
};

declare global {
  namespace Express {
    interface Request {
      user?: payload_type.IAuthPayload;
    }
  }
}

const permissionDeniedError = (res: express.Response) => {
  return response.responseErrorMessage(res, 403, {
    error: "Permission denied!",
  });
};

const authenticateToken: RequestHandler = (req, res, next) => {
  const bearer_token: string | undefined = req.headers["authorization"];

  if (!bearer_token) {
    return response.responseErrorMessage(res, 400, {
      error: "Missing token! please try again using a valid one",
    });
  }

  try {
    const access_token: string = bearer_token.split(" ")[1];

    jwt.verify(
      access_token,
      dotenvconfig.JWT_ACCESS,
      (
        err: jwt.VerifyErrors | null,
        decoded: jwt.JwtPayload | string | undefined
      ) => {
        if (err) {
          return response.responseErrorMessage(res, 401, {
            error:
              "Invalid token or expired! please try again using a valid one",
          });
        }

        const payload = decoded as payload_type.IAuthPayload;

        req.user = payload;
        return next();
      }
    );
  } catch (e) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid token or expired! please try again using a valid one",
    });
  }
};

export const authorizeSuperAdmin: RequestHandler = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    if (!staff) {
      return permissionDeniedError(res);
    }

    const is_super_admin: boolean = staff.email === dotenvconfig.SUPER_ADMIN;

    if (is_super_admin) {
      return next();
    }

    return permissionDeniedError(res);
  });
};

export const authorizeUserSelf: RequestHandler = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const user: user_type.THydratedUserDocument | null =
      await user_service.findUserByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    if (!user) return permissionDeniedError(res);

    const is_user_self: boolean =
      user.email === req.body?.email ||
      user._id.toString() === req.params?.userId ||
      user._id.toString() === req.query?.userId;

    if (is_user_self) {
      return next();
    }

    return permissionDeniedError(res);
  });
};

export const authorizeStaffSelf: RequestHandler = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    if (!staff) return permissionDeniedError(res);

    const is_staff_self: boolean =
      staff.email === req.body?.email ||
      staff._id.toString() === req.params?.staffId ||
      staff._id.toString() === req.query?.staffId;

    const staff_auth_roles: string[] = [
      auth_account_roles.admin,
      auth_account_roles.editor,
    ];

    if (is_staff_self && staff_auth_roles.includes(staff.role)) {
      return next();
    }

    return permissionDeniedError(res);
  });
};

export const authorizeStaffRolesAndSelf: RequestHandler = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    if (!staff) return permissionDeniedError(res);

    const is_staff_self: boolean =
      staff.email === req.body?.email ||
      staff._id.toString() === req.params?.staffId ||
      staff._id.toString() === req.query?.staffId;

    const staff_auth_roles: string[] = [
      auth_account_roles.admin,
      auth_account_roles.editor,
      auth_account_roles.guest,
    ];

    if (staff_auth_roles.includes(staff.role) && is_staff_self) {
      return next();
    }

    return permissionDeniedError(res);
  });
};

export const authorizeStaff: RequestHandler = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    if (!staff) return permissionDeniedError(res);

    const staff_roles: string[] = [
      auth_account_roles.admin,
      auth_account_roles.editor,
    ];

    if (staff_roles.includes(staff.role)) {
      return next();
    }

    return permissionDeniedError(res);
  });
};

export const authorizeAdminStaff: RequestHandler = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    if (!staff) return permissionDeniedError(res);

    const is_admin: boolean = staff.role === auth_account_roles.admin;

    if (is_admin) {
      return next();
    }

    return permissionDeniedError(res);
  });
};

export const authorizeUserSelfOrStaff: RequestHandler = (req, res, next) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    const user: user_type.THydratedUserDocument | null =
      await user_service.findUserByProp({ key: "_id", value: req.user._id });

    if (!staff || !user) return permissionDeniedError(res);

    const auth_staff_roles: string[] = [
      auth_account_roles.admin,
      auth_account_roles.editor,
    ];

    const is_staff: boolean = auth_staff_roles.includes(staff.role);

    const is_user_self: boolean =
      user.email === req.user.email ||
      user._id.toString() === req.params?.userId ||
      user._id.toString() === req.query?.userId;

    if (is_staff || is_user_self) {
      return next();
    }

    return permissionDeniedError(res);
  });
};

export const authorizeUserSelfOrAdminStaff: RequestHandler = (
  req,
  res,
  next
) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    const user: user_type.THydratedUserDocument | null =
      await user_service.findUserByProp({ key: "_id", value: req.user._id });

    if (!staff || !user) return permissionDeniedError(res);

    const is_admin: boolean = staff.role === auth_account_roles.admin;

    const is_user_self: boolean =
      user.email === req.user.email ||
      user._id.toString() === req.params?.userId ||
      user._id.toString() === req.query?.userId;

    if (is_admin || is_user_self) {
      return next();
    }

    return permissionDeniedError(res);
  });
};

export const authorizeSuperAdminOrStaffSelf: RequestHandler = (
  req,
  res,
  next
) => {
  authenticateToken(req, res, async () => {
    if (!req.user) return permissionDeniedError(res);

    const staff: staff_type.THydratedStaffDocument | null =
      await staff_service.findStaffByProp({
        key: "_id",
        value: req.user._id.toString(),
      });

    if (!staff) return permissionDeniedError(res);

    const is_super_admin: boolean =
      staff.role === auth_account_roles.admin &&
      staff.email === dotenvconfig.SUPER_ADMIN;

    const auth_staff_roles: string[] = [
      auth_account_roles.admin,
      auth_account_roles.editor,
    ];

    const is_staff_self: boolean =
      auth_staff_roles.includes(staff.role) &&
      (staff.email === req.body?.email ||
        staff._id.toString() === req.params?.staffId ||
        staff._id.toString() === req.query?.staffId);

    if (is_staff_self || is_super_admin) {
      return next();
    } else {
      return permissionDeniedError(res);
    }
  });
};
