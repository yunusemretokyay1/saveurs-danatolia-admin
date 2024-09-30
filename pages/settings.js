import { useState, useEffect } from 'react';
import Layout from "@/components/Layout";

export default function SettingsPage() {
    const [shippingLimit, setShippingLimit] = useState("");
    const [serviceCharge, setServiceCharge] = useState("");  // Changed here
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');

                if (!response.ok) {
                    throw new Error('Error fetching settings');
                }

                const data = await response.json();

                // Check for null and set default values
                setShippingLimit(data?.shippingLimit || "");
                setServiceCharge(data?.serviceCharge || "");  // Changed here
            } catch (err) {
                console.error(err);
                setError('An error occurred while loading settings.');
            }
        };

        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Reset previous messages
        setError(""); // Reset previous errors

        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shippingLimit, serviceCharge }),  // Changed here
            });

            if (response.ok) {
                setMessage('Settings updated successfully!'); // Success message
            } else {
                const { message } = await response.json();
                setError(message || 'Update error');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while saving settings.');
        }
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Shipping Limit:
                            <input
                                type="text"
                                value={shippingLimit}
                                onChange={(e) => setShippingLimit(e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Service Charge:  {/* Updated label here */}
                            <input
                                type="text"
                                value={serviceCharge}  // Updated here
                                onChange={(e) => setServiceCharge(e.target.value)}  // Updated here
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
                    >
                        Save
                    </button>
                </form>
                {message && <p className="text-green-600 mt-4">{message}</p>} {/* Success message */}
                {error && <p className="text-red-600 mt-4">{error}</p>} {/* Error message */}
            </div>
        </Layout>
    );
}
