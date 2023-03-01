import express from "express";
import userController from "../controller/userController.js";
import verifytoken from "../middleware/verifyToken.js";
import { refreshToken } from "../controller/refreshToken.js";
const router = express.Router();

router.get("/users", verifytoken, userController.getUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/token", refreshToken);
router.delete("/logout", userController.logout);

export default router;
