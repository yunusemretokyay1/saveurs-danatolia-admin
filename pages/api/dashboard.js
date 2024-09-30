import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    await mongooseConnect();

    try {
        const orderCount = await Order.countDocuments();
        const productCount = await Product.countDocuments();

        const newOrders = await Order.find({ status: 'confirmed' }).countDocuments();
        const pendingOrders = await Order.find({ status: 'pending' }).countDocuments();
        const canceledOrders = await Order.find({ status: 'canceled' }).countDocuments();


        const totalSoldProducts = await Order.aggregate([
            { $unwind: '$line_items' },
            {
                $group: {
                    _id: null,
                    totalSold: { $sum: '$line_items.quantity' }
                }
            }
        ]);


        const lowStockThreshold = 10;
        const lowStockProductsCount = await Product.countDocuments({ quantity: { $lt: lowStockThreshold } });


        const decreasingStockCount = await Product.countDocuments({ quantity: { $lt: 5 } });


        const totalRevenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        const topSellingProducts = await Order.aggregate([
            { $unwind: '$line_items' },
            {
                $group: {
                    _id: '$line_items.productId',
                    totalSold: { $sum: '$line_items.quantity' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]).exec();

        const products = await Product.find({ _id: { $in: topSellingProducts.map(p => p._id) } });

        const topSellingProductsWithInfo = topSellingProducts.map((item) => {
            const productInfo = products.find(p => p._id.equals(item._id));
            return {
                ...item,
                productInfo,
            }
        });

        res.status(200).json({
            orderCount,
            productCount,
            newOrders,
            pendingOrders,
            canceledOrders,
            totalSoldProducts: totalSoldProducts[0]?.totalSold || 0,
            lowStockProducts: lowStockProductsCount,
            decreasingStock: decreasingStockCount,
            totalRevenue: totalRevenue[0]?.total || 0,
            topSellingProducts: topSellingProductsWithInfo
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Error fetching dashboard data" });
    }
}
