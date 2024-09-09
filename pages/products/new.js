import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [goToProducts, setGoToProducts] = useState('');
    const router = useRouter();
    async function createProduct(ev) {

        ev.preventDefault();
        const data = { title, description, price };
        await axios.post('/api/products', data);
        setGoToProducts(true);
    }
    if (goToProducts) {
       router.push('/products');

    }

    return (
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New Product</h1>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={title}
                    onChange={ev => setTitle(ev.target.value)} />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={ev => setDescription(ev.target.value)} />

                <label>Price (in £)</label>
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={ev => setPrice(ev.target.value)} />

                <button type="submit" className="btn-primary">Save</button> {/* className düzeltildi */}
            </form>
        </Layout>
    );
}
