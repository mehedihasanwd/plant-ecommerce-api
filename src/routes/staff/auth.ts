import express from "express";
import { staff_controller } from "../../controllers";
import { setLimiter } from "../../utils";
import * as authorization from "../../middleware/authenticate";

const router: express.Router = express.Router();

interface IStaffAuthRoute {
  verifyEmail: "/verify-email";
  register: "/register";
  login: "/login";
  logout: "/logout";
  forgotPassword: "/forgot-password";
  resetPassword: "/reset-password";
  changePassword: "/change-password";
  verifyStaffEmail: "/verify-staff-email";
  updateStaffEmail: "/update-staff-email";
  accessToken: "/access-token";
}

const staff_auth_route: IStaffAuthRoute = {
  verifyEmail: "/verify-email",
  register: "/register",
  login: "/login",
  logout: "/logout",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  changePassword: "/change-password",
  verifyStaffEmail: "/verify-staff-email",
  updateStaffEmail: "/update-staff-email",
  accessToken: "/access-token",
};

// verify-email
router.post(
  staff_auth_route.verifyEmail,
  setLimiter(10),
  staff_controller.postVerifyEmail
);

// register
router.post(
  staff_auth_route.register,
  setLimiter(10),
  staff_controller.postRegisterStaff
);

// login
router.post(staff_auth_route.login, staff_controller.postLoginStaff);

// logout
router.post(
  staff_auth_route.logout,
  authorization.authorizeStaffRolesAndSelf,
  staff_controller.postLogoutStaff
);

// forgot-password
router.post(
  staff_auth_route.forgotPassword,
  setLimiter(15),
  staff_controller.postForgotPassword
);

// reset-password
router.patch(
  staff_auth_route.resetPassword,
  staff_controller.patchResetStaffPassword
);

// change-password
router.patch(
  staff_auth_route.changePassword,
  authorization.authorizeStaffSelf,
  staff_controller.patchChangeStaffPassword
);

// verify-staff-email
router.post(
  staff_auth_route.verifyStaffEmail,
  authorization.authorizeStaffSelf,
  staff_controller.postVerifyStaffEmail
);

// update-staff-email
router.patch(
  staff_auth_route.updateStaffEmail,
  authorization.authorizeStaffSelf,
  staff_controller.patchUpdateStaffEmail
);

// get new access_token
router.get(
  staff_auth_route.accessToken,
  authorization.authorizeStaffSelf,
  staff_controller.getNewAccessToken
);

export default router;
