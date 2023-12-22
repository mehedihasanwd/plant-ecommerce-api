import express from "express";

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
router.route(category_route.base_path).post().get();

// get active categories
router.get(category_route.active_categories, () => {});

// get inactive categoreis
router.get(category_route.inactive_categories, () => {});

// category by id
router.route(category_route.category_by_id).get().patch().put().delete();

export default router;
