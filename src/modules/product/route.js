import express from "express";
import { validateJwt } from "../../middlewares/auth.js";
import { authorizeRole } from "../../middlewares/roleChecker.js";
import { upload } from "../../middlewares/upload.js";
import {
  createProduct,
  getPaginatedListOfProducts,
  getProduct,
  searchProduct,
  updateProduct,
} from "./controller.js";
const product = express.Router();

product.post(
  "/",
  validateJwt,
  authorizeRole("Vendor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "product_images", maxCount: 3 },
  ]),
  createProduct
);

product.get("/", getPaginatedListOfProducts);

product.get("/search", searchProduct);

product.get("/:productId", getProduct);

product.put(
  "/:productId",
  validateJwt,
  authorizeRole("Vendor"),
  authorizeRole("Vendor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "product_images", maxCount: 3 },
  ]),
  updateProduct
);

product.delete("/:productId", validateJwt, authorizeRole("Vendor"));

export default product;
