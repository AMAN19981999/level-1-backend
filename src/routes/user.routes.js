import { Router } from "express";
import { registeterUser } from "../controllers/user.controller.js";
const router = Router();

import { upload } from "./../middlewares/multer.middleware.js";

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImages",
      maxCount: 1,
    },
  ]),
  registeterUser
);
// router.route("/login").get();

export default router;
