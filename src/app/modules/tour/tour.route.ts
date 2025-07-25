import { Router } from "express";
import { tourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema } from "./tour.validation";

const router = Router();

// for tour types
router.get("/tour-types", tourControllers.getAllTourTypes);
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourControllers.createTourType
);
router.patch('/tour-types/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN) ,tourControllers.updateTourType)
router.delete('/tour-types/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.deleteTourType)


// routes for Tour
router.get('/', tourControllers.getAllTour)
router.post('/create', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.createTour)
router.patch('/:id',checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.updateTour)
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourControllers.deleteTour)

export const tourRoutes = router;
