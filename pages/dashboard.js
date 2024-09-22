// pages/dashboard.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import TopSellingProductsChart from "@/components/TopSellingProductsChart";

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        productCount: 0,
        orderCount: 0,
        newOrders: 0,
        pendingOrders: 0,
        canceledOrders: 0,
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
                <div>Total Products: {dashboardData.productCount}</div>
                <div>Total Orders: {dashboardData.orderCount}</div>
                <div>New Orders: {dashboardData.newOrders}</div>
                <div>Pending Orders: {dashboardData.pendingOrders}</div>
                <div>Canceled Orders: {dashboardData.canceledOrders}</div>
                <div>
                    <TopSellingProductsChart topSellingProducts={dashboardData.topSellingProducts} />
                </div>
            </div>
        </Layout>
    );
}
