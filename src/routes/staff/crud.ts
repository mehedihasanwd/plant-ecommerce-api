import express from "express";
import { staff_controller } from "../../controllers";
import * as authorization from "../../middleware/authenticate";

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
router.get(
  crud_route.base_path,
  authorization.authorizeStaff,
  staff_controller.getStaffs
);

// staff by id
router
  .route(crud_route.staff_by_id)
  .get(authorization.authorizeStaff, staff_controller.getStaffById)
  .patch(
    authorization.authorizeSuperAdmin,
    staff_controller.patchUpdateStaffRoleById
  )
  .put(authorization.authorizeStaffSelf, staff_controller.putUpdateStaffById)
  .delete(
    authorization.authorizeSuperAdminOrStaffSelf,
    staff_controller.deleteStaffById
  );

export default router;
