import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNote, deleteNote, getNoteById, getNotes } from "../controllers/note.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createNote);

router.route("/").get(getNotes)

router.route("/:id").get(getNoteById)

router.route("/:id").delete(deleteNote)

export default router