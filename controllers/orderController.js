import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {
	try {
		if (req.user == null) {
			res.status(401).json({ message: "Please login to create an order" });
			return;
		}
		// A00323

		const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

		let orderId = "A00323";

		if (latestOrder.length > 0) {
			//if old orders exist //"A00323"
			const lastOrderIdInString = latestOrder[0].orderId; //"A00323"
			const lastOrderIdWithoutPrefix = lastOrderIdInString.replace("A00", ""); //"00323"
			const lastOrderIdInInteger = parseInt(lastOrderIdWithoutPrefix); //323
			const newOrderIdInInteger = lastOrderIdInInteger + 1; //323
			const newOrderIdWithoutPrefix = newOrderIdInInteger
				.toString()
				.padStart(5, "0"); // "00636"
			orderId = "A00" + newOrderIdWithoutPrefix; // "CBC00636"
		}
		const items = [];
		let total = 0;

		if (req.body.items !== null && Array.isArray(req.body.items)) {
			for (let i = 0; i < req.body.items.length; i++) {
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
					quantity: item.quantity,
				};

				total += product.price * item.quantity;
			}
		} else {
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
	} catch (error) {
		console.error("Error creating order:", error);
		res.status(500).json({ message: "Failed to create order" });
	}
}

export async function getOrders(req, res) {
	const page = parseInt(req.params.page) || 1;  //string to number parseInt  because page is a string
	const limit = parseInt(req.params.limit) || 10;   //for one page how many or default 10

	if (req.user == null) {
		res.status(401).json({ message: "Please login to view orders" });
		return;
	}

	try {
		if (req.user.role == "admin") {

			const orderCount = await Order.countDocuments();//  count how many orders are there

			const totalPages = Math.ceil(orderCount / limit);// Calculate total pages by the division of total orders by limit and rounding off to celing value 

            const orders = await Order.find().skip((page-1) *limit).limit(limit).sort({ date: -1 });   //skip first few multiples of limit  with page-1 and  get a particular page  adn    limit next 10

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
			{ orderId: orderId },
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
