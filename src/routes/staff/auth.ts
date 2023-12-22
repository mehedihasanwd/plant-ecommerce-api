import express from "express";

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
router.post(staff_auth_route.verifyEmail, () => {});

// register
router.post(staff_auth_route.register, () => {});

// login
router.post(staff_auth_route.login, () => {});

// logout
router.post(staff_auth_route.logout, () => {});

// forgot-password
router.post(staff_auth_route.forgotPassword, () => {});

// reset-password
router.patch(staff_auth_route.resetPassword, () => {});

// change-password
router.patch(staff_auth_route.changePassword, () => {});

// verify-staff-email
router.post(staff_auth_route.verifyStaffEmail, () => {});

// update-staff-email
router.patch(staff_auth_route.updateStaffEmail, () => {});

// get new access_token
router.get(staff_auth_route.accessToken, () => {});

export default router;
