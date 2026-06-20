import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { registerUser, loginUser, getCurrentUser, logoutUser, changePassword, updateDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
  upload.fields([{
    name: "avatar",
    maxCount: 1
  }]),
  registerUser
)

router.route("/login").post(loginUser)


//secure routes
router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("change-password").patch(verifyJWT, changePassword)

router.route("update-details").patch(verifyJWT, updateDetails)


export default router