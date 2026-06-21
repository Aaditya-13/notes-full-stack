import { Router } from "express";

import { verifyJWT }from "../middlewares/auth.middleware.js";

import {
  createTag,
  getTags,
  updateTag,
  deleteTag
} from "../controllers/tag.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .post(createTag)
  .get(getTags);

router.route("/:id")
  .patch(updateTag)
  .delete(deleteTag);

export default router;