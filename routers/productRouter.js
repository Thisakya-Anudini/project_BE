import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductinfo, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getAllProducts);
productRouter.delete("/:ProductId", deleteProduct); 
productRouter.put("/:ProductId", updateProduct);
productRouter.get("/:productId", getProductinfo);
    
export default productRouter;

