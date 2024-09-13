import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";
import Spinner from "@/components/Spinner";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title, description, price, images,
        };
        if (_id) {
            // Update existing product
            await axios.put('/api/products', { ...data, _id });
        } else {
            // Create new product
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
        return null;
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => [...oldImages, ...res.data.links]);
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input
                type="text"
                placeholder="Product name"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    list={images}
                    setList={updateImagesOrder}
                    className="flex flex-wrap gap-1"
                >
                    {images.length > 0 && images.map(link => (
                        <div key={link} className="inline-block w-24 h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <img src={link} alt="" className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>

                {isUploading && (
                    <div className="h-24 flex items-center"> <Spinner /></div>
                )}

                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Add Image</div>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
            </div>

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

            <button
                type="submit"
                className="btn-primary">
                Save
            </button>
        </form>
    );
}
