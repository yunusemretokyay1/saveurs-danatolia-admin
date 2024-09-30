import mongoose, { Schema } from 'mongoose'; // Ensure Schema is imported

const OrderSchema = new Schema({
    line_items: [{ type: Object, required: true }],
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    streetAddress: { type: String, required: true },
    country: { type: String, required: true },
    paid: { type: Boolean, default: false },
    service: { type: String, required: false },
    location: { type: String, required: false },
    dateTime: { type: Date, required: false },
    total: { type: Number, required: true },
}, {
    timestamps: true,
});


export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
