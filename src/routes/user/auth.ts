import express from "express";
import * as authorization from "../../middleware/authenticate";
import { user_controller } from "../../controllers";
import { setLimiter } from "../../utils";

const router: express.Router = express.Router();

interface IUserAuthRoute {
  verifyEmail: "/verify-email";
  register: "/register";
  login: "/login";
  logout: "/logout";
  forgotPassword: "/forgot-password";
  resetPassword: "/reset-password";
  changePassword: "/change-password";
  verifyUserEmail: "/verify-user-email";
  updateUserEmail: "/update-user-email";
  accessToken: "/access-token";
}

const user_auth_route: IUserAuthRoute = {
  verifyEmail: "/verify-email",
  register: "/register",
  login: "/login",
  logout: "/logout",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  changePassword: "/change-password",
  verifyUserEmail: "/verify-user-email",
  updateUserEmail: "/update-user-email",
  accessToken: "/access-token",
};

// verify-email
router.post(
  user_auth_route.verifyEmail,
  setLimiter(15),
  user_controller.postVerifyEmail
);

// register
router.post(user_auth_route.register, user_controller.postRegisterUser);

// login
router.post(user_auth_route.login, user_controller.postLoginUser);

// logout
router.post(
  user_auth_route.logout,
  authorization.authorizeUserSelf,
  user_controller.postLogoutUser
);

// forgot-password
router.post(
  user_auth_route.forgotPassword,
  setLimiter(15),
  user_controller.postForgotPassword
);

// reset-password
router.patch(
  user_auth_route.resetPassword,
  user_controller.patchResetUserPassword
);

// change-password
router.patch(
  user_auth_route.changePassword,
  user_controller.patchChangeUserPassword
);

// verify-user-email
router.post(
  user_auth_route.verifyUserEmail,
  authorization.authorizeUserSelf,
  user_controller.postVerifyUserEmail
);

// update-user-email
router.patch(
  user_auth_route.updateUserEmail,
  authorization.authorizeUserSelf,
  user_controller.patchUpdateUserEmail
);

// get new access_token
router.get(
  user_auth_route.accessToken,
  authorization.authorizeUserSelf,
  user_controller.getNewAccessToken
);

export default router;
