const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number, require: true },
    token: { type: String, required: true },
    walletAddress: { type: String, required: true },
    //chain: { type: String, required: true },
    durationType: { type: String, required: true },
    durationCount: { type: String, required: true },
    description: { type: String, required: true },
    isChannelBase: { type: Boolean, require: true },
    channelList: { type: Array },
    constrains: { type: Object }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);