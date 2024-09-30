import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { sendEmail } from "@/lib/sendEmail";

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


            const emailContent = `
                <h1>Your Order Has Been Canceled</h1>
                <p>Dear ${order.name},</p>
                <p>Your order has been canceled successfully. If you have any questions, feel free to contact us.</p>
                <p>Order details:</p>
                <ul>
                    ${order.line_items.map(item => `<li>${item.name}: ${item.quantity} pcs</li>`).join('')}
                </ul>
            `;

            await sendEmail({
                to: order.email,
                subject: 'Order Cancellation - Your Order Has Been Canceled',
                html: emailContent,
            });

            res.status(200).json({ message: 'Order canceled and email sent' });
        } catch (error) {
            console.error('Error canceling order:', error);
            res.status(500).json({ message: 'Error canceling order' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
