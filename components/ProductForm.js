import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import { ReactSortable } from 'react-sortablejs';
import Spinner from "@/components/Spinner";
import Link from "next/link";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
    barcode: existingBarcode,
    quantity: existingQuantity,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const [barcode, setBarcode] = useState(existingBarcode || '');
    const [showScanner, setShowScanner] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [quantity, setQuantity] = useState(existingQuantity || '');

    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }, []);

    const saveProduct = async (ev) => {
        ev.preventDefault();
        const data = { title, description, price, images, barcode, category, properties: productProperties, quantity };

        try {
            if (_id) {
                await axios.put('/api/products', { ...data, _id });
            } else {
                await axios.post('/api/products', data);
            }
            setGoToProducts(true);
        } catch (error) {
            console.error("Failed to save product:", error);
        }
    };

    if (goToProducts) {
        router.push('/products');
        return null;
    }

    const uploadImages = async (ev) => {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            try {
                const res = await axios.post('/api/upload', data);
                setImages(prevImages => [...prevImages, ...res.data.links]);
            } catch (error) {
                console.error("Failed to upload images:", error);
            }
            setIsUploading(false);
        }
    };

    const updateImagesOrder = (images) => {
        setImages(images);
    };

    const handleBarcodeDetected = (result) => {
        if (result?.text) {
            setBarcode(result.text);
            setShowScanner(false);
        }
    };

    const handleBarcodeError = (err) => {
        console.error("Barcode scan error:", err);
    };

    const toggleScanning = () => {
        setShowScanner(prev => !prev);
    };

    const setProductProp = (propName, value) => {
        setProductProperties(prev => ({
            ...prev,
            [propName]: value,
        }));
    };

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        while (catInfo) {
            if (Array.isArray(catInfo.properties)) {
                propertiesToFill.push(...catInfo.properties);
            }
            catInfo = catInfo.parent ? categories.find(({ _id }) => _id === catInfo.parent._id) : null;
        }
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

            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map(p => {
                const propertyName = p.name || 'Unknown Property';

                return (
                    <div key={propertyName} className="mb-2">
                        <label>{propertyName[0].toUpperCase() + propertyName.substring(1)}</label>
                        <div>
                            <select
                                value={productProperties[propertyName] || ''}
                                onChange={ev => setProductProp(propertyName, ev.target.value)}
                            >
                                {p.values.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );
            })}

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-1">
                    {images.map(link => (
                        <div key={link} className="inline-block w-24 h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <img src={link} alt="" className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>

                {isUploading && <div className="h-24 flex items-center"><Spinner /></div>}

                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-black rounded-sm bg-white shadow-sm border border-gray">
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

            <div>
                <label>Barcode</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Barcode"
                        value={barcode}
                        onChange={ev => setBarcode(ev.target.value)}
                        style={{ marginRight: '8px' }}
                    />
                    <Link
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            toggleScanning();
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 12px',
                            backgroundColor: '#0f1111',
                            color: 'white',
                            borderRadius: '2px',
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" style={{ marginRight: '8px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5l6.75 6.75 6.75-6.75M12 15V3" />
                        </svg>
                        {showScanner ? 'Stop Scanning' : 'Start Scanning'}
                    </Link>
                </div>

                {showScanner && (
                    <div style={{ width: '100%', height: '400px' }}>
                        <QrReader
                            onResult={handleBarcodeDetected}
                            onError={handleBarcodeError}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                )}
            </div>

            <label>Quantity</label>
            <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={ev => setQuantity(ev.target.value)}
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
                className="btn-primary"
            >
                Save
            </button>
        </form>
    );
}
