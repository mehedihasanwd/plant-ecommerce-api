import express from "express";
import * as authorization from "../../middleware/authenticate";
import { user_controller } from "../../controllers";

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
router.get(
  crud_route.base_path,
  authorization.authorizeStaff,
  user_controller.getUsers
);

// user by id
router
  .route(crud_route.user_by_id)
  .get(authorization.authorizeUserSelfOrStaff, user_controller.getUserById)
  .put(authorization.authorizeUserSelf, user_controller.putUpdateUserById)
  .delete(authorization.authorizeUserSelfOrAdminStaff);

export default router;
