import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import ProductModal from "@/components/ProductModal";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 7;
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [total, setTotal] = useState(0); // New state for total

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
            // Confirm the order via API
            const response = await axios.post('/api/orders/confirm', { orderId, lineItems });
            setSuccessMessage('Order confirmed successfully!');

            // Update local state to reflect confirmation
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: 'confirmed' } : order
                )
            );
        } catch (error) {
            console.error('Error confirming order:', error);
            setSuccessMessage('Failed to confirm order.');
        }
    };

    const openModal = (lineItems) => {
        const totalAmount = lineItems.reduce((total, item) => total + (item.price_data.unit_amount * item.quantity), 0);
        setSelectedProducts(lineItems); // Store line items for the modal
        setTotal(totalAmount); // Set the total amount
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProducts([]); // Reset selected products
        setTotal(0); // Reset total
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold">
                Orders
                <Link href="/canceled-orders" className="ml-4 text-blue-500 underline">
                    Canceled Orders
                </Link>
            </h1>
            {successMessage && <div className="text-green-500">{successMessage}</div>}

            <h2 className="text-xl mt-6">Active Orders</h2>
            <table className="min-w-full border border-gray-200 mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Paid</th>
                        <th className="px-4 py-2 border">Recipient</th>
                        <th className="px-4 py-2 border">Products</th>
                        <th className="px-4 py-2 border">Service</th>
                        <th className="px-4 py-2 border">Location</th>
                        <th className="px-4 py-2 border">Date/Time</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map(order => (
                        <tr key={order._id}>
                            <td className="border px-4 py-2">{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td className={`border px-4 py-2 ${order.paid ? 'text-green-600' : 'text-red-600'}`}>
                                {order.paid ? 'YES' : 'NO'}
                            </td>
                            <td className="border px-4 py-2">
                                {order.name} {order.email}<br />
                                {order.city} {order.postalCode} {order.country}<br />
                                {order.streetAddress}
                            </td>
                            <td className="border px-4 py-2">
                                {order.line_items.length} products
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                                    onClick={() => openModal(order.line_items)}>
                                    Details
                                </button>
                            </td>
                            <td className="border px-4 py-2">
                                {order.service || 'N/A'}
                            </td>
                            <td className="border px-4 py-2">
                                {order.location || 'N/A'}
                            </td>
                            <td className="border px-4 py-2">
                                {order.dateTime ? (new Date(order.dateTime)).toLocaleString() : 'N/A'}
                            </td>
                            <td className="border px-4 py-2">
                                {order.status === 'confirmed' ? (
                                    <span className="text-green-600">Confirmed</span>
                                ) : (
                                    <>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                                            onClick={() => handleConfirmOrder(order._id, order.line_items)}>
                                            Confirm
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleCancelOrder(order._id)}>
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="8" className="border px-4 py-2 text-center">No active orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-between mt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`bg-gray-400 text-white px-4 py-2 rounded-md ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}>
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`bg-gray-400 text-white px-4 py-2 rounded-md ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}>
                    Next
                </button>
            </div>

            {/* Product Modal */}
            <ProductModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                products={selectedProducts}
                total={total}
            />
        </Layout>
    );
}
