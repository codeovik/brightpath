import express from "express";
import {
    signup,
    signin,
    signout,
    googleLogin,
    googleCallback,
    facebookLogin,
    facebookCallback,
    setupProfile,
    getMe,
    deleteAccount
} from "../controllers/auth.controller.js";
import protectUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/facebook", facebookLogin);
router.get("/facebook/callback", facebookCallback);

router.get("/me", protectUser, getMe);
router.post("/setup-profile", protectUser, setupProfile);
router.delete("/delete-account", protectUser, deleteAccount);

export default router;
