import { Router } from "express";
import { registeterUser,loginUser, loggedOutUser,generateRefershToken } from "../controllers/user.controller.js";
const router = Router();

import { upload } from "./../middlewares/multer.middleware.js";
import { jwtVerify } from './../middlewares/auth.middleware.js';

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
router.route("/login").post(loginUser);
router.route("/logout").post(jwtVerify,loggedOutUser);
router.route("/refresh-token").post(generateRefershToken);


export default router;
