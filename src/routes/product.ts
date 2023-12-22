import express from "express";

const router: express.Router = express.Router();

interface IProductRoute {
  base_path: "/";
  product_by_id: "/p/:productId";
  get_active_products: "/active";
  get_inactive_products: "/inactive";
  get_discount_products: "/discount";
  get_instock_products: "/instock";
  get_stockout_products: "/stockout";
  get_product_by_slug: "/p/s/:slug";
  get_regular_products: "/top-category/regular";
  get_featured_products: "/top-category/featured";
  get_highestrated_products: "/top-category/highestrated";
  get_bestseller_products: "/top-category/bestseller";
  patch_product_discount_by_id: "/discount/p/:productId";
  patch_product_stock_by_id: "/stock/p/:productId";
}

const product_route: IProductRoute = {
  base_path: "/",
  product_by_id: "/p/:productId",
  get_active_products: "/active",
  get_inactive_products: "/inactive",
  get_discount_products: "/discount",
  get_instock_products: "/instock",
  get_stockout_products: "/stockout",
  get_product_by_slug: "/p/s/:slug",
  get_regular_products: "/top-category/regular",
  get_featured_products: "/top-category/featured",
  get_bestseller_products: "/top-category/bestseller",
  get_highestrated_products: "/top-category/highestrated",
  patch_product_discount_by_id: "/discount/p/:productId",
  patch_product_stock_by_id: "/stock/p/:productId",
};

// post new product, get products
router.route(product_route.base_path).post().get();

// get active products
router.get(product_route.get_active_products, () => {});

// get inactive products
router.get(product_route.get_inactive_products, () => {});

// get instock products
router.get(product_route.get_instock_products, () => {});

// get stockout products
router.get(product_route.get_stockout_products, () => {});

// get regular products
router.get(product_route.get_regular_products, () => {});

// get featured products
router.get(product_route.get_featured_products, () => {});

// get highestrated products
router.get(product_route.get_highestrated_products, () => {});

// get bestseller products
router.get(product_route.get_bestseller_products, () => {});

// update product discount by id
router.patch(product_route.patch_product_discount_by_id, () => {});

// update product stock by id
router.patch(product_route.patch_product_stock_by_id, () => {});

// product by id
router.route(product_route.product_by_id).get().patch().delete().delete();

export default router;
