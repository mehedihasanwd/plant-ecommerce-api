import express from "express";

const router: express.Router = express.Router();

interface IReviewRoute {
  base_path: "/";
  review_by_id: "/r/:reviewId";
  get_reviews_by_product_id: "/p/:productId";
  get_reviews_by_user_id: "/u/:userId";
  get_reviews_by_order_id: "/o/:orderId";
  get_reviews_by_rating: "/rating";
}

const review_route: IReviewRoute = {
  base_path: "/",
  review_by_id: "/r/:reviewId",
  get_reviews_by_product_id: "/p/:productId",
  get_reviews_by_user_id: "/u/:userId",
  get_reviews_by_order_id: "/o/:orderId",
  get_reviews_by_rating: "/rating",
};

// post new review and get reviews
router.route(review_route.base_path).get().post();

// get reviews by rating
router.get(review_route.get_reviews_by_rating, () => {});

// get reviews by product id
router.get(review_route.get_reviews_by_product_id, () => {});

// get reviews by user id
router.get(review_route.get_reviews_by_user_id, () => {});

// get reviews by order id
router.get(review_route.get_reviews_by_order_id, () => {});

// review by id
router.route(review_route.review_by_id).get().put().delete();

export default router;
