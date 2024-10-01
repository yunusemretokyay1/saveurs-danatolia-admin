import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { sendEmail } from "@/lib/sendEmail";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { orderId, lineItems } = req.body;

        await mongooseConnect();

        try {
            // Find the order by ID
            const order = await Order.findById(orderId);
            if (!order) {
                console.log(`Order not found for ID: ${orderId}`);
                return res.status(404).json({ message: 'Order not found' });
            }

            let totalAmount = 0;

            // Update product quantities and calculate total amount
            for (const item of lineItems) {
                const product = await Product.findById(item.price_data.product_data.id);
                if (product) {
                    product.quantity -= item.quantity; // Deduct the quantity
                    await product.save(); // Save the updated product
                }
                // Calculate total for this item
                const itemTotal = item.price_data.unit_amount * item.quantity;
                totalAmount += itemTotal; // Add to total amount
            }

            // Update order status to "confirmed" and set it as paid
            order.status = 'confirmed';
            order.paid = true;
            order.total = totalAmount; // Save the total amount to the order

            // Save the updated order to the database
            const savedOrder = await order.save();
            console.log(`Order saved: ${savedOrder}`); // Log the saved order

            // Prepare email content
            const emailContent = `
                <h1>Confirmation de commande</h1>
                <p>Cher ${order.name},</p>
                <p>Votre commande a été confirmée avec succès. Votre commande sera livrée à l'emplacement suivant :</p>
                <p><strong>Service:</strong> ${order.service || 'Non spécifié'}</p>
                <p><strong>Location:</strong> ${order.location || 'Non spécifié'}</p>
                <p><strong>Date/Heure:</strong> ${order.dateTime ? (new Date(order.dateTime)).toLocaleString() : 'Non spécifié'}</p>
                <p><strong>Montant total:</strong> €${(totalAmount / 100).toFixed(2)}</p>
                <p>Détails de la commande:</p>
                <ul>
                    ${lineItems.map(item => `<li>${item.price_data.product_data.name}: ${item.quantity} pcs - €${(item.price_data.unit_amount / 100).toFixed(2)} chacun</li>`).join('')}
                </ul>
                <p>Merci pour votre achat!</p>
            `;

            // Send confirmation email
            try {
                await sendEmail({
                    to: order.email,
                    subject: 'Confirmation de commande - Merci pour votre achat',
                    html: emailContent,
                });
                console.log(`Email sent to: ${order.email}`); // Log successful email sending
            } catch (emailError) {
                console.error("Error sending email:", emailError); // Log email sending error
                return res.status(500).json({ message: 'Order confirmed but email failed to send' });
            }

            return res.status(200).json({ message: 'Order confirmed and email sent', order: savedOrder }); // Return the saved order
        } catch (error) {
            console.error("Error confirming order:", error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
