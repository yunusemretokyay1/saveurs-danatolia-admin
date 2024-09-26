// pages/api/orders/index.js
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    await mongooseConnect();
    const { page = 1, limit = 6 } = req.query;

    try {
        const orders = await Order.find()
            .populate('line_items.product') // Ensure the line_items are populated correctly
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments();
        res.json({
            orders,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
