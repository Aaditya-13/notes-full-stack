import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNote, getNotes } from "../controllers/note.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createNote);

router.route("/").get(getNotes)

export default router