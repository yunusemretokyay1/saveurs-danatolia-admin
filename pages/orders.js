// pages/orders.js
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
    const [selectedProducts, setSelectedProducts] = useState([]); // Change this to an array for multiple products
    const [modalIsOpen, setModalIsOpen] = useState(false);

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

    const openModal = (lineItems) => { // Change to receive lineItems
        setSelectedProducts(lineItems); // Store line items
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProducts([]); // Reset selected products
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
                                {/* Display the number of products */}
                                {order.line_items.length} products
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
                                    onClick={() => openModal(order.line_items)}> {/* Pass line items to modal */}
                                    Details
                                </button>
                            </td>
                            <td className="border px-4 py-2">
                                {order.status === 'confirmed' ? (
                                    <span className="text-green-600">Confirmed</span>
                                ) : (
                                    <>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                                            onClick={() => handleConfirmOrder(order._id, order.line_items)}>
                                            Confirm Order
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleCancelOrder(order._id)}>
                                            Cancel Order
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="border text-center px-4 py-2">No active orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <button
                    className="bg-gray-300 px-4 py-2 rounded-md"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="bg-gray-300 px-4 py-2 rounded-md"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {/* Product Modal */}
            <ProductModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                products={selectedProducts} // Pass selected products to the modal
            />
        </Layout>
    );
}
