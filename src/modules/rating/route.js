import express from "express";
import { validateJwt } from "../../middlewares/auth.js";
import { createRating, deleteRating, updateRating } from "./controller.js";
const rating = express.Router();

rating.post("/:productId", validateJwt, createRating);

rating.patch("/:rateId", validateJwt, updateRating);

rating.delete("/:rateId", validateJwt, deleteRating);

export default rating;
