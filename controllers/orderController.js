import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


export async function createOrder(req, res) {

    if (req.user == null) {
        res.status(401).json({ message: "Please login first" })
        return; 
    }
    //order ID= A00323      max 99999


    const latestOrder = await Order.find().sort({ date: -1 }).limit(1).exec();  //date -1 is for descending order . need to get latest order date   limit 1 is for getting only one order 
      
    let orderId="A00323"

    if (latestOrder.length > 0) {
        // if  latest order exists
        const latestOrderIdString = latestOrder[0].orderId;//A00323

        const latestOrderIdWithoutPrefix =latestOrderIdString.replace("A00", ""); //00323
        const latestOrderIdInteger = parseInt(latestOrderIdWithoutPrefix);      //  323

        const newOrderIdInteger = latestOrderIdInteger + 1;//324
        const newOrderIdWithoutPrefix = newOrderIdInteger.toString().padStart(5, "0");//00324
        orderId = "A00" + newOrderIdWithoutPrefix; //A00324
    }
		const items = [];//check if items are provided and it's in an array	
		let total = 0;

		if (req.body.items !== null && Array.isArray(req.body.items)) {    
			for (let i = 0; i < req.body.items.length; i++) {//check if items are provided
				let item = req.body.items[i];

				// console.log(item)

				let product = await Product.findOne({
					productId: item.productId,
				});

				if (product == null) {
					res
						.status(400)
						.json({ message: "Invalid product ID: " + item.productId });
					return;
				}
				items[i] = {
					productId: product.productId,
					name: product.name,
					image: product.images[0],
					price: product.price,
					qty: item.qty,
				};

				total += product.price * item.qty;
			}
		} else {//if items are not provided as array
			res.status(400).json({ message: "Invalid items format" });
			return;
		}

		const order = new Order({
			orderId: orderId,
			email: req.user.email,
			name: req.user.firstName + " " + req.user.lastName,
			address: req.body.address,
			phone: req.body.phone,
			items: items,
			total: total,
		});

		const result = await order.save();

		res.json({
			message: "Order created successfully",
			result: result,
		});
    }


export async function getOrders(req, res) {
	const page = parseInt(req.params.page) || 1;
	const limit = parseInt(req.params.limit) || 10;

	if (req.user == null) {
		res.status(401).json({ message: "Please login to view orders" });
		return;
	}

	try {
		if (req.user.role == "admin") {

			const orderCount = await Order.countDocuments();

			const totalPages = Math.ceil(orderCount / limit);// Calculate total pages by rounding the division of total orders by limit

            const orders = await Order.find().skip((page-1) *limit).limit(limit).sort({ date: -1 });

            res.json({
				orders: orders,
				totalPages: totalPages,
			});
		}else{
			const orderCount = await Order.countDocuments({ email: req.user.email });
			const totalPages = Math.ceil(orderCount / limit);
            const orders = await Order.find({ email: req.user.email }).skip((page-1) * limit).limit(limit).sort({ date: -1 });
            res.json({
				orders: orders,
				totalPages: totalPages,
			});
        }
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ message: "Failed to fetch orders" });
	}
}
export function updateOrder(req,res){
	if(isAdmin(req)){
		const orderId = req.params.orderId;
		const status = req.body.status;
		const notes = req.body.notes;

		Order.findOneAndUpdate(
			{ orderID: orderId },
			{ status: status , notes: notes },
			{ new: true }
		).then(
			(updatedOrder) => {
				if (updatedOrder) {
					res.json({
						message: "Order updated successfully",
						order: updatedOrder,
					});
				} else {
					res.status(404).json({ message: "Order not found" });
				}
			}
		).catch(
			(error) => {
				console.error("Error updating order:", error);
				res.status(500).json({ message: "Failed to update order" });
			}
		);
	}else{
		res.status(403).json({
			message : "You are not authorized to update orders"
		})
	}












    
    } 

   




