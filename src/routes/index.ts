import express from "express";
import { response } from "../utils";
import staff from "./staff";
import user from "./user";
import category from "./category";
import coupon from "./coupon";
import product from "./product";
import order from "./order";
import review from "./review";

const router: express.Router = express.Router();

interface IRoutePath {
  health: "/api/v1/health";
  staff_auth: "/api/v1/auth/staffs";
  user_auth: "/api/v1/auth/users";
  staff_crud: "/api/v1/staffs";
  user_crud: "/api/v1/users";
  category: "/api/v1/categories";
  product: "/api/v1/products";
  order: "/api/v1/orders";
  review: "/api/v1/reviews";
  coupon: "/api/v1/coupons";
}

const route_path: IRoutePath = {
  health: "/api/v1/health",
  staff_auth: "/api/v1/auth/staffs",
  user_auth: "/api/v1/auth/users",
  staff_crud: "/api/v1/staffs",
  user_crud: "/api/v1/users",
  category: "/api/v1/categories",
  product: "/api/v1/products",
  order: "/api/v1/orders",
  review: "/api/v1/reviews",
  coupon: "/api/v1/coupons",
};

const getHealth: express.RequestHandler = (
  req,
  res,
  next
): express.Response => {
  return response.responseSuccessMessage(res, 200, { message: "Success" });
};

router.get(route_path.health, getHealth);

router.use(route_path.staff_auth, staff.auth);
router.use(route_path.user_auth, user.auth);
router.use(route_path.staff_crud, staff.crud);
router.use(route_path.user_crud, user.crud);
router.use(route_path.category, category);
router.use(route_path.product, product);
router.use(route_path.order, order);
router.use(route_path.review, review);
router.use(route_path.coupon, coupon);

export default router;
