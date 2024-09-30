import { mongooseConnect } from "@/lib/mongoose";
import Settings from "@/models/Settings";

export default async function handler(req, res) {
    await mongooseConnect(); // Ensure you're connecting to the database correctly.

    if (req.method === 'GET') {
        try {
            const settings = await Settings.findOne();
            return res.status(200).json(settings);
        } catch (error) {
            console.error("GET error:", error);
            return res.status(500).json({ message: 'Error fetching data.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { shippingLimit, serviceCharge } = req.body;


            if (isNaN(shippingLimit)) {
                return res.status(400).json({ message: 'Shipping limit must be a number.' });
            }

            console.log('Incoming data:', { shippingLimit, serviceCharge });

            await Settings.findOneAndUpdate({}, { shippingLimit, serviceCharge }, { upsert: true });
            return res.status(200).json({ message: 'Settings updated successfully' });
        } catch (error) {
            console.error("POST error:", error.message);
            return res.status(500).json({ message: error.message || 'Error updating settings.' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
