import express from "express";

const router: express.Router = express.Router();

interface IOrderRoute {
  base_path: "/";
  order_by_id: "/o/:orderId";
  get_orders_by_user_id: "/u/:userId";
  get_orders_by_product_id: "/p/:productId";
  get_orderered_products: "/products";
  get_ordered_products_by_user_id: "/products/u/:userId";
  get_ordered_products_by_product_id: "/products/p/:productId";
  get_ordered_products_by_order_id: "/products/o/:orderId";
}

const order_route: IOrderRoute = {
  base_path: "/",
  order_by_id: "/o/:orderId",
  get_orders_by_user_id: "/u/:userId",
  get_orders_by_product_id: "/p/:productId",
  get_orderered_products: "/products",
  get_ordered_products_by_user_id: "/products/u/:userId",
  get_ordered_products_by_product_id: "/products/p/:productId",
  get_ordered_products_by_order_id: "/products/o/:orderId",
};

// post new order, get orders
router.route(order_route.base_path).get().post();

// get ordered products
router.get(order_route.get_orderered_products);

// order get, update, delete by id routes
router.route(order_route.order_by_id).get().patch().delete();

// get orders by user id
router.get(order_route.get_orders_by_user_id);

// get orders by product id
router.get(order_route.get_orders_by_product_id);

// get ordered products by product id
router.get(order_route.get_ordered_products_by_product_id);

// get ordered products by user id
router.get(order_route.get_ordered_products_by_user_id);

// get ordered products by order id
router.get(order_route.get_ordered_products_by_order_id);

export default router;
