import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.route";
import { divisionRoutes } from "../modules/division/division.routes";
import { tourRoutes } from "../modules/tour/tour.route";
import { bookingRoutes } from "../modules/booking/booking.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { OtpRoutes } from "../modules/otp/otp.routes";

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
    },
    {
        path: '/tour',
        route: tourRoutes
    },
    {
        path: '/booking',
        route: bookingRoutes
    },
    {
        path: '/tour',
        route: tourRoutes
    },
    {
        path: '/payment',
        route: PaymentRoutes
    },
    {
        path: '/otp',
        route: OtpRoutes
    }
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})