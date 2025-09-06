import express from "express";
import { createProduct, searchProducts } from "../controllers/productController.js"; 
import { getProducts } from "../controllers/productController.js";
import { deleteProduct } from "../controllers/productController.js";
import { updateProduct } from "../controllers/productController.js";
import { getProductInfo } from "../controllers/productController.js";
const productRouter = express.Router();

// POST route for creating a product
productRouter.post("/", createProduct);

productRouter.get("/", getProducts);
productRouter.get("/:productId", getProductInfo);

productRouter.delete("/:productId", deleteProduct);

productRouter.put("/:productId", updateProduct);

productRouter.get("/search/:query", searchProducts);


export default productRouter;
