import express from "express";
import { validateJwt } from "../../middlewares/auth.js";
import { authorizeRole } from "../../middlewares/roleChecker.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "./controller.js";
const category = express.Router();

category.post("/", validateJwt, authorizeRole("Admin"), createCategory);

category.get("/:categoryId", getCategory);

category.get("/", getAllCategory);

category.patch(
  "/:categoryId",
  validateJwt,
  authorizeRole("Admin"),
  updateCategory
);

category.delete(
  "/:categoryId",
  validateJwt,
  authorizeRole("Admin"),
  deleteCategory
);

export default category;
