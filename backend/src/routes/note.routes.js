import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { archiveNote, createNote, deleteNote, getNoteById, getNotes, pinNote, trashNote, updateNote } from "../controllers/note.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createNote);

router.route("/").get(getNotes)

router.route("/:id").get(getNoteById)

router.route("/:id").delete(deleteNote)

router.route("/:id").patch(updateNote)

router.route("/:id/pin").patch(pinNote)

router.route("/:id/archive").patch(archiveNote)

router.route("/:id/trash").patch(trashNote)

router.route("/:noteId/add-tag").patch(addTagToNote);

router.route("/:noteId/remove-tag").patch(removeTagFromNote);

export default router