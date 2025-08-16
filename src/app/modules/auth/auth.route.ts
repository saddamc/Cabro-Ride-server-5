import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);

router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword);

router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword);

router.post("/forgot-password", AuthControllers.forgotPassword);

router.patch("/verify-user", AuthControllers.userVerification);

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req, res, next)
}); 

router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}?error=There is some issues with your account. Please contact with out support team! ` }), AuthControllers.googleCallbackController) 

router.patch("/apply-driver", checkAuth(...Object.values(Role)), AuthControllers.applyDriver)


export const AuthRoutes = router;
