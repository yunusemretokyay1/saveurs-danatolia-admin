// pages/dashboard.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        productCount: 0,
        orderCount: 0,
        totalRevenue: 0,
        canceledOrders: 0,
        lowStockProducts: 0,
        decreasingStock: 0,
        topSellingProducts: [],
    });

    useEffect(() => {
        async function fetchDashboardData() {
            const res = await fetch("/api/dashboard");
            const data = await res.json();
            setDashboardData(data);
        }
        fetchDashboardData();
    }, []);

    return (
        <Layout>
            <div>
                <h1>Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-500 text-white p-4 rounded shadow">
                        <h2>Total Sold Products</h2>
                        <p>{dashboardData.orderCount}</p>
                    </div>
                    <div className="bg-red-500 text-white p-4 rounded shadow">
                        <h2>Canceled Orders</h2>
                        <p>{dashboardData.canceledOrders}</p>
                    </div>
                    <div className="bg-yellow-500 text-white p-4 rounded shadow">
                        <h2>Low Stock Products</h2>
                        <p>{dashboardData.lowStockProducts}</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded shadow">
                        <h2>Decreasing Stock</h2>
                        <p>{dashboardData.decreasingStock}</p>
                    </div>
                    <div className="bg-purple-500 text-white p-4 rounded shadow">
                        <h2>Total Revenue</h2>
                        <p>${(dashboardData.totalRevenue || 0).toFixed(2)}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <h2>Top Selling Products</h2>
                    <ul>
                        {dashboardData.topSellingProducts.map(product => (
                            <li key={product.id}>
                                {product.name}: {product.sales} sold
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
}
