import express from "express";

const router: express.Router = express.Router();

interface ICrudRoute {
  base_path: "/";
  user_by_id: "/u/:userId";
}

const crud_route: ICrudRoute = {
  base_path: "/",
  user_by_id: "/u/:userId",
};

// get users
router.get(crud_route.base_path, () => {});

// user by id
router.route(crud_route.user_by_id).get().put().delete();

export default router;
