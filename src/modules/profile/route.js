import express from "express";
import { validateJwt } from "../../middlewares/auth.js";
import { checkBlacklistedToken } from "../../middlewares/blacklist.js";
import {
  fileFilter,
  handlefileSizeLimitError,
  upload,
} from "../../middlewares/upload.js";
import {
  deleteAccount,
  getPrivateProfile,
  getPublicProfile,
  updateProfile,
} from "./controller.js";
const profile = express.Router();

profile.put(
  "/",
  validateJwt,
  checkBlacklistedToken,
  upload.single("file"),
  fileFilter,
  handlefileSizeLimitError,
  updateProfile
);

profile.get(
  "/public/:userId",
  validateJwt,
  checkBlacklistedToken,
  getPublicProfile
);

profile.get(
  "/private",
  validateJwt,
  checkBlacklistedToken,
  getPrivateProfile
);

profile.delete(
  "/delete-account",
  validateJwt,
  checkBlacklistedToken,
  deleteAccount
);

export default profile;
