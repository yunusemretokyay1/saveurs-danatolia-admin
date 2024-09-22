import axios from "axios";

export default function CanceledOrders({ canceledOrders }) {
    return (
        <div>
            <h2>Canceled Orders</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {canceledOrders.length > 0 ? canceledOrders.map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
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
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3">No canceled orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
