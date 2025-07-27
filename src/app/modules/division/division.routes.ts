import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";

const router = Router();
router.get("/", divisionController.getDivision);
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.createDivision,
  validateRequest(createDivisionZodSchema)
);
router.get('/:slug', divisionController.getSingleDivision)

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionZodSchema),
  divisionController.updateDivision
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision
);

export const divisionRoutes = router;
