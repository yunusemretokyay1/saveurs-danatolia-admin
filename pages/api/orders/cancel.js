import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await mongooseConnect();

        const { orderId } = req.body;

        try {
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            await Order.findByIdAndDelete(orderId);

            for (const item of order.line_items) {
                await Product.findByIdAndUpdate(item.price_data.product_data.id, {
                    $inc: { quantity: item.quantity }
                });
            }

            res.status(200).json({ message: 'Order canceled successfully' });
        } catch (error) {
            console.error('Error canceling order:', error);
            res.status(500).json({ message: 'Error canceling order' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}