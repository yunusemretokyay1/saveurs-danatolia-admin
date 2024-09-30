// components/ProductModal.js
import Modal from "react-modal";

const ProductModal = ({ isOpen, onRequestClose, products, total }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2 className="text-xl font-bold">Product Details</h2>
            <button onClick={onRequestClose} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Close
            </button>
            <ul className="mt-4">
                {products.map((product, index) => (
                    <li key={index} className="border-b py-2">
                        {product.price_data?.product_data.name} x {product.quantity}
                    </li>
                ))}
            </ul>
            {/* Display the total amount */}
            <div className="mt-4 font-bold">
                Total: ${(total / 100).toFixed(2)} {/* Assuming total is in cents */}
            </div>
        </Modal>
    );
};

export default ProductModal;
