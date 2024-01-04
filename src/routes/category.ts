import express from "express";
import * as authorization from "../middleware/authenticate";
import { category_controller } from "../controllers";

const router: express.Router = express.Router();

interface ICategoryRoute {
  base_path: "/";
  active_categories: "/active";
  inactive_categories: "/inactive";
  category_by_id: "/ca/:categoryId";
}

const category_route: ICategoryRoute = {
  base_path: "/",
  active_categories: "/active",
  inactive_categories: "/inactive",
  category_by_id: "/ca/:categoryId",
};

// post new categories, get categories
router
  .route(category_route.base_path)
  .post(authorization.authorizeAdminStaff, category_controller.postNewCategory)
  .get(authorization.authorizeStaff, category_controller.getCategories);

// get active categories
router.get(
  category_route.active_categories,
  authorization.authorizeStaff,
  category_controller.getActiveCategories
);

// get inactive categoreis
router.get(
  category_route.inactive_categories,
  authorization.authorizeStaff,
  category_controller.getInactiveCategories
);

// category by id
router
  .route(category_route.category_by_id)
  .get(authorization.authorizeStaff, category_controller.getCategoryById)
  .patch(
    authorization.authorizeStaff,
    category_controller.patchUpdateCategoryStatusById
  )
  .put(authorization.authorizeStaff, category_controller.putUpdateCategoryById)
  .delete(
    authorization.authorizeAdminStaff,
    category_controller.deleteCategoryById
  );

export default router;
