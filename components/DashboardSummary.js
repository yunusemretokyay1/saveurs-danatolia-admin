export default function DashboardSummary({ data }) {
    const { productCount, orderCount, lowStockProducts } = data;

    return (
        <div>
            <div className="summary-section">
                <h2>Summary</h2>
                <div className="summary-item">
                    <span>Total Products:</span>
                    <strong>{productCount}</strong>
                </div>
                <div className="summary-item">
                    <span>Total Orders:</span>
                    <strong>{orderCount}</strong>
                </div>
            </div>

            {lowStockProducts.length > 0 && (
                <div className="low-stock-section">
                    <h2>Low Stock Alerts</h2>
                    <ul>
                        {lowStockProducts.map(product => (
                            <li key={product._id} className="low-stock-item">
                                {product.name} - Stock: {product.stock} units
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
