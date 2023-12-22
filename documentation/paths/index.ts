import { getHealth } from "./health";
import * as staff from "./staff";
import * as user from "./user";
import * as category from "./category";
import * as product from "./product";
import * as order from "./order";
import * as review from "./review";

export default {
  "/health": getHealth,

  "/auth/staffs/verify-email": staff.post_verify_new_staff_email,

  "/auth/staffs/register": staff.post_register_staff,

  "/auth/staffs/login": staff.post_login_staff,

  "/auth/staffs/logout": staff.post_logout_staff,

  "/auth/staffs/forgot-password": staff.post_forgot_password,

  "/auth/staffs/reset-password": staff.patch_reset_password,

  "/auth/staffs/change-password": staff.patch_change_password,

  "/auth/staffs/verify-staff-email": staff.post_verify_staff_email,

  "/auth/staffs/update-staff-email": staff.patch_update_staff_email,

  "/auth/staffs/access-token": staff.get_new_access_token,

  "/staffs": staff.get_staffs,

  "/staffs/s/{staffId}": staff.staff_by_id,

  "/auth/users/verify-email": user.post_verify_new_user_email,

  "/auth/users/register": user.post_register_user,

  "/auth/users/login": user.post_login_user,

  "/auth/users/logout": user.post_logout_user,

  "/auth/users/forgot-password": user.post_forgot_password,

  "/auth/users/reset-password": user.patch_reset_password,

  "/auth/users/change-password": user.patch_change_password,

  "/auth/users/verify-user-email": user.post_verify_user_email,

  "/auth/users/update-user-email": user.patch_update_user_email,

  "/auth/users/access-token": user.get_new_access_token,

  "/users": user.get_users,

  "/users/u/{userId}": user.user_by_id,

  "/categories": category.get_post_category,

  "/categories/active": category.get_active_categories,

  "/categories/inactive": category.get_inactive_categories,

  "/categories/ca/{categoryId}": category.category_by_id,

  "/products": product.get_post_product,

  "/products/active": product.get_active_products,

  "/products/inactive": product.get_inactive_products,

  "/products/discount": product.get_dicount_products,

  "/products/instock": product.get_instock_products,

  "/products/stockout": product.get_stockout_products,

  "/products/top-category/regular": product.get_regular_products,

  "/products/top-category/featured": product.get_featured_products,

  "/products/top-category/highestrated": product.get_highestrated_products,

  "/products/top-category/bestseller": product.get_bestselling_products,

  "/products/p/s/{slug}": product.get_product_by_slug,

  "/products/p/{productId}": product.product_by_id,

  "/products/discount/p/:productId": product.patch_product_discount_by_id,

  "/products/stock/p/:productId": product.patch_product_stock_by_id,

  "/orders": order.get_post_order,

  "/orders/o/:orderId": "order by id",

  "/orders/o/:userId": "get orders by userId",

  "/orders/o/:productId": "get orders by productId",

  "/orders/products": "get ordered products",

  "/orders/products/u/:userId": "get ordered products by userId",

  "/orders/products/p/:productId": "get ordered products by productId",

  "/orders/products/o/:orderId": "get ordered products by orderId",

  "/reviews": review.get_post_review,

  "/reviews/u/:userId": review.get_reviews_by_userId,

  "/reviews/p/:productId": review.get_reviews_by_productId,

  "/reviews/o/:orderId": review.get_reviews_by_orderId,

  "/reviews/rating": review.get_reviews_by_rating,

  "/reviews/r/:reviewId": review.review_by_id,
};
