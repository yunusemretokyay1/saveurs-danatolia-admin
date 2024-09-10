import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false); // Eklendi
    const router = useRouter(); // Güncellendi

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title,
            description,
            price
        };

        try {
            if (_id) {
                // Update
                await axios.put('/api/products', { ...data, _id });
            } else {
                // Create
                await axios.post('/api/products', data);
            }
            setGoToProducts(true);
        } catch (error) {
            console.error("An error occurred while saving the product:", error);
            // Hata mesajı gösterme veya kullanıcıyı bilgilendirme işlemleri yapılabilir
        }
    }

    if (goToProducts) {
        router.push('/products');
        return null; // Prevent form from rendering after redirect
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input
                type="text"
                placeholder="Product Name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            <label>Description</label>
            <textarea
                placeholder="Description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />

            <label>Price (in USD)</label>
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />

            <button type="submit" className="btn-primary">
                Save
            </button>
        </form>
    );
}
