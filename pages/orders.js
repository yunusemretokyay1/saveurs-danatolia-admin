import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 7;
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const fetchOrders = async (page) => {
        try {
            const response = await axios.get(`/api/orders?page=${page}&limit=${limit}`);
            const activeOrders = response.data.orders.filter(order => order.status !== 'canceled');
            setOrders(activeOrders);
            setTotalPages(response.data.totalPages);
            setSuccessMessage('');
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.post('/api/orders/cancel', { orderId });
            setSuccessMessage('Order canceled successfully!');
            fetchOrders(currentPage);
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const handleConfirmOrder = async (orderId, lineItems) => {
        try {
            await axios.post('/api/orders/confirm', { orderId, lineItems });
            setSuccessMessage('Order confirmed successfully!');
            fetchOrders(currentPage);
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    return (
        <Layout>
            <h1>
                Orders
                <Link href="/canceled-orders" className="ml-4 text-blue-500 underline">
                    Canceled Orders
                </Link>
            </h1>
            {successMessage && <div className="success-message">{successMessage}</div>}

            <h2>Active Orders</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map(order => (
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
                                {order.line_items.map(l => (
                                    <div key={l.id}>
                                        {l.price_data?.product_data.name} x {l.quantity}<br />
                                    </div>
                                ))}
                            </td>
                            <td>
                                {order.status === 'confirmed' ? (
                                    <span className="text-green-600">Confirmed</span>
                                ) : (
                                    <>
                                        <button className="btn-green mr-2" onClick={() => handleConfirmOrder(order._id, order.line_items)}>
                                            Confirm Order
                                        </button>
                                        <button className="btn-red" onClick={() => handleCancelOrder(order._id)}>
                                            Cancel Order
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5">No active orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </Layout>
    );
}
