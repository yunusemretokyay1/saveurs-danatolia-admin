import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { orderId, lineItems } = req.body;

        await mongooseConnect();

        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            for (const item of lineItems) {
                const product = await Product.findById(item.price_data.product_data.id);
                if (product) {
                    product.quantity -= item.quantity;
                    await product.save();
                }
            }

            order.status = 'confirmed';
            order.paid = true;
            await order.save();

            return res.status(200).json({ message: 'Order confirmed', order });
        } catch (error) {
            console.error("Error confirming order:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
