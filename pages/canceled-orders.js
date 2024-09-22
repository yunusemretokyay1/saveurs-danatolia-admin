import Layout from "@/components/Layout";
import CanceledOrders from "@/components/CanceledOrders";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CanceledOrdersPage() {
    const [canceledOrders, setCanceledOrders] = useState([]);

    useEffect(() => {
        fetchCanceledOrders();
    }, []);

    const fetchCanceledOrders = async () => {
        try {
            const response = await axios.get(`/api/orders?status=canceled`);
            setCanceledOrders(response.data.orders);
        } catch (error) {
            console.error("Error fetching canceled orders:", error);
        }
    };

    return (
        <Layout>
            <h1>Canceled Orders</h1>
            <CanceledOrders canceledOrders={canceledOrders} />

            <Link href="/orders" className="mt-4 inline-block text-blue-500 underline">
                Back to Orders
            </Link>
        </Layout>
    );
}
