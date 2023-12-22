import express from "express";

const router: express.Router = express.Router();

interface ICrudRoute {
  base_path: "/";
  staff_by_id: "/s/:staffId";
}

const crud_route: ICrudRoute = {
  base_path: "/",
  staff_by_id: "/s/:staffId",
};

// get staffs
router.get(crud_route.base_path, () => {});

// staff by id
router.route(crud_route.staff_by_id).get().patch().put().delete();

export default router;
