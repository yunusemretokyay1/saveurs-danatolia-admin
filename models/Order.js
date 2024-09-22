// models/Order.js
import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
}, {
    timestamps: true,
});

export const Order = models.Order || model('Order', OrderSchema);
