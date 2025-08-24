import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res){
    
    if(!isAdmin(req)){
        return res.status(403).json({message:"Access denied. Admins only"});
    }

    const product=new Product(req.body);
    
    try{
        const response=await product.save();
        res.json({
            message : "Product created",
            product : response
        })
    }
    catch(error){
        
            console.error("error creating product",error);
            return res.status(500).json({message:"failed to create product"})
        
    }
    
}

//get all products
export async function getProducts(req,res){
    try{
        if(isAdmin(req)){
            const products=await Product.find();
            return res.json(products);}//show all products to admin
        else{
            const products=await Product.find({isAvailable:true});
            return res.json(products);//show only available products to users
        }
        }
        catch(error){
            console.error("error fetching products",error);
            return res.status(500).json({message:"failed to fetch products"})
        }
    }

    export async function deleteProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied. Admins only" });
    return;
  }

  try {
    const productId = req.params.productId;
    await Product.deleteOne({ productId: productId });

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("error deleting product", error);
    return res.status(500).json({ message: "failed to delete product" });
  }
}


export async function updateProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied. Admins only" });
  }

  const data = req.body;
  const productId = req.params.productId;
  //to prevent user from changing productId

  try {
    const result = await Product.updateOne({ productId: productId }, data);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated" });
  } catch (error) {
    console.error("error updating product", error);
    return res.status(500).json({ message: "failed to update product" });
  }
}

export async function getProductInfo(req, res) {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId: productId });

    if (product == null) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (isAdmin(req)) {
      return res.json(product);
    } else {
      if (product.isAvailable) {
        return res.json(product);
      } else {
        return res.status(404).json({ message: "Product is not available" });
      }
    }
  } catch (error) {
    console.error("error fetching product info", error);
    return res.status(500).json({ message: "failed to fetch product info" });
  }
}