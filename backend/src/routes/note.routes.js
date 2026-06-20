import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNote } from "../controllers/note.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createNote);

export default router