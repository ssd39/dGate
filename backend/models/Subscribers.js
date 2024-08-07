const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true },
    subId: { type: String, required: true },
    lastPaidAt: { type: Date },
    joinedOn: { type: Date },
    discordId: { type: String, required: true }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);