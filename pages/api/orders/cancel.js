import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { sendEmail } from "@/lib/sendEmail";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await mongooseConnect();

        const { orderId } = req.body;

        try {
            // Siparişi ID ile bul
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Ürün stoklarını geri yükle
            for (const item of order.line_items) {
                await Product.findByIdAndUpdate(item.price_data.product_data.id, {
                    $inc: { quantity: item.quantity }
                });
            }

            const totalAmount = order.line_items.reduce((total, item) => total + (item.price_data.unit_amount * item.quantity), 0);

            // E-posta içeriğini hazırla (Fransızca)
            const emailContent = `
                <h1>Annulation de commande</h1>
                <p>Cher ${order.name},</p>
                <p>Votre commande a été annulée avec succès. Voici les détails :</p>
                <p><strong>Service:</strong> ${order.service || 'Non spécifié'}</p>
                <p><strong>Location:</strong> ${order.location || 'Non spécifié'}</p>
                <p><strong>Montant total:</strong> €${(totalAmount / 100).toFixed(2)}</p>
                <p>Détails de la commande:</p>
                <ul>
                    ${order.line_items.map(item => `<li>${item.price_data.product_data.name}: ${item.quantity} pcs</li>`).join('')}
                </ul>
                <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            `;

            // İptal e-postasını gönder
            await sendEmail({
                to: order.email,
                subject: 'Annulation de commande - Votre commande a été annulée',
                html: emailContent,
            });

            // Siparişi veritabanından sil
            await Order.findByIdAndDelete(orderId);

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
