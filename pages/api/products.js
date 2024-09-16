import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        } else {
            res.json(await Product.find());
        }
    }

    if (method === 'POST') {
        const { title, description, price, images, category, properties, barcode, quantity } = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties, barcode, quantity
        });
        res.json(productDoc);
    }

    if (method === 'PUT') {
        // Destructure _id from req.body
        const { _id, title, description, price, images, category, properties, barcode, quantity } = req.body;

        if (!_id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        // Update the product document with the given _id
        await Product.updateOne({ _id }, { title, description, price, images, category, properties, barcode, quantity });
        res.json({ success: true });
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query.id });
            res.json({ success: true });
        } else {
            res.status(400).json({ error: "Product ID is required" });
        }
    }
}
