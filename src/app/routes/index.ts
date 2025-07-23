import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { divisionRoutes } from "../modules/division/division.routes";

export const router = Router()

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/division',
        route: divisionRoutes
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})