import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/orders');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders');
                console.error(err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <Layout>
            <h1>Orders</h1>
            {error && <p className="text-red-600">{error}</p>}
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <tr key={order._id}>
                                <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                                <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                    {order.paid ? 'YES' : 'NO'}
                                </td>
                                <td>
                                    {order.name} {order.email}<br />
                                    {order.city} {order.postalCode} {order.country}<br />
                                    {order.streetAddress}
                                </td>
                                <td>
                                    {order.line_items.map((l, index) => (
                                        <div key={index}>
                                            {l.price_data?.product_data.name} x {l.quantity}<br />
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No orders available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Layout>
    );
}
