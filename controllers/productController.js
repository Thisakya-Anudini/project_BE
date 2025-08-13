import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {

    if (!isAdmin(req) ) {
        res.status(403).json({
            message: "Only admin can create products"
        })
        return;
    }

    

    
    const product = new Product(req.body);
    try {
        const response = await product.save();
        console.log("Product created:", response);  // Log successful creation
        return res.json({
            message: "Product created successfully",
            product: response
        });
    } catch (err) {
        console.error("Error creating product:", err);  // Log any errors
        return res.status(500).json({
            message: "Failed to create product",
            error: err.message
        });
    }
}

export async function getAllProducts(req,res) {
    if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can delete a product" });
}






    try {

        if (isAdmin(req)){
        const products = await Product.find();
        return res.json(products);
         
        } else {
            const products = await Product.find({isAvailable:true});
            return res.json(products);
            
     
        }




    } catch (err) {
        console.error("Error fetching products:", err);  // Log any errors
        return res.status(500).json({
            message: "Failed to fetch products",
            error: err.message
        });
    }
}


export async function deleteProduct(req, res) {

    if (!isAdmin(req) ) {
        res.status(403).json({
            message: "Only admin can delete a product"
        })
        return;
    }
    try {
        const productId = req.params.ProductId;  // Get ProductId from URL parameter

        // Find the product by ProductId and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });  // If no product is found
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Error deleting product",
            error: error.message
        });
    }
}




 export async function getProductinfo(req, res) {
    try {
        const productId = req.params.productId;  // This now correctly gets `productId` from URL
        const product = await Product.findOne({ ProductID: productId });  // Query by ProductID

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (isAdmin(req)) {
            return res.json(product);  // Admin can view product details
        } else {
            if (product.isAvailable === true) {
                return res.json(product);  // If the product is available, send the product
            } else {
                return res.status(404).json({ message: "Product not available" });
            }
        }
    } catch (err) {
        console.error("Error fetching product:", err);
        return res.status(500).json({
            message: "Failed to fetch product",
            error: err.message
        });
    }
}





export async function updateProduct(req, res) {

    // Check if the user is an admin
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Only admin can update a product"
        });
    }

    const data = req.body;  // The data sent in the request body
    const productId = req.params.ProductId;  // Extract ProductId from the URL parameter

    // Remove ProductID from the request body to ensure it is not updated
    delete data.ProductID;

    try {
        // Update the product by ProductID (match by ProductID, exclude ProductID from update)
        const updatedProduct = await Product.updateOne(
            { ProductID: productId },  // Match by ProductID from the URL
            data  // Use the request body data (excluding ProductID)
        );

        // If no product was found and updated, return a 404
        if (updatedProduct.matchedCount === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully"
        });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({
            message: "Failed to update product",
            error: err.message
        });
    }
}
