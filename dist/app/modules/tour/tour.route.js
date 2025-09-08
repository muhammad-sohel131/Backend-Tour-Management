"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourRoutes = void 0;
const express_1 = require("express");
const tour_controller_1 = require("./tour.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const tour_validation_1 = require("./tour.validation");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// for tour types
router.get("/tour-types", tour_controller_1.tourControllers.getAllTourTypes);
router.post("/create-tour-type", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tour_validation_1.createTourTypeZodSchema), tour_controller_1.tourControllers.createTourType);
router.patch("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.tourControllers.updateTourType);
router.delete("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.tourControllers.deleteTourType);
// routes for Tour
router.get("/", tour_controller_1.tourControllers.getAllTour);
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array('files'), tour_controller_1.tourControllers.createTour);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array('files'), tour_controller_1.tourControllers.updateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.tourControllers.deleteTour);
exports.tourRoutes = router;
