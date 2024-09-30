import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    shippingLimit: {
        type: Number,
        required: true,
        default: 0,
    },
    serviceCharge: {
        type: Number,
        required: false,
    },
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
