import {Router} from "express";
import { getProduct } from "../controllers/product/getProduct.js";
import { putProduct } from "../controllers/product/putProduct.js";
import { postProduct } from "../controllers/product/postProduct.js";

export const laptopProductRouter = Router()

laptopProductRouter.get("/", getProduct)
laptopProductRouter.post("/create", postProduct)
laptopProductRouter.post("/update/:id", putProduct)