// pages/api/dashboard.js
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose"; // Doğru import fonksiyonu

export default async function handler(req, res) {
    await mongooseConnect(); // Burada doğru fonksiyonu kullanıyoruz

    try {
        // Sipariş ve ürün verilerini al
        const orderCount = await Order.countDocuments();
        const productCount = await Product.countDocuments();
        const newOrders = await Order.find({ status: 'confirmed' }).countDocuments();
        const pendingOrders = await Order.find({ status: 'pending' }).countDocuments();
        const canceledOrders = await Order.find({ status: 'canceled' }).countDocuments();

        const topSellingProducts = await Order.aggregate([
            { $unwind: '$line_items' }, // Her siparişteki ürünleri ayır
            {
                $group: {
                    _id: '$line_items.productId', // Gruplama: ürün bazında
                    totalSold: { $sum: '$line_items.quantity' } // Satılan miktarları toplama
                }
            },
            { $sort: { totalSold: -1 } }, // En çok satılanları sıralama
            { $limit: 5 } // İlk 5 ürünü alma
        ]).exec();

        // En çok satan ürünlerin bilgilerini al
        const products = await Product.find({ _id: { $in: topSellingProducts.map(p => p._id) } });

        const topSellingProductsWithInfo = topSellingProducts.map((item) => {
            const productInfo = products.find(p => p._id.equals(item._id)); // Ürün bilgisini bul
            return {
                ...item,
                productInfo, // Ürün bilgilerini ekliyoruz
            };
        });

        // Tüm verileri geri döndür
        res.status(200).json({
            orderCount,
            productCount,
            newOrders,
            pendingOrders,
            canceledOrders,
            topSellingProducts: topSellingProductsWithInfo
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Error fetching dashboard data" });
    }
}
