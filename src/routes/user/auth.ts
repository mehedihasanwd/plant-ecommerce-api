import express from "express";

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
router.post(user_auth_route.verifyEmail, () => {});

// register
router.post(user_auth_route.register, () => {});

// login
router.post(user_auth_route.login, () => {});

// logout
router.post(user_auth_route.logout, () => {});

// forgot-password
router.post(user_auth_route.forgotPassword, () => {});

// reset-password
router.patch(user_auth_route.resetPassword, () => {});

// change-password
router.patch(user_auth_route.changePassword, () => {});

// verify-user-email
router.post(user_auth_route.verifyUserEmail, () => {});

// update-user-email
router.patch(user_auth_route.updateUserEmail, () => {});

// get new access_token
router.get(user_auth_route.accessToken, () => {});

export default router;
