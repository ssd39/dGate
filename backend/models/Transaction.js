const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    subscriber: { type: String, required: true },
    subId: { type: String, required: true },
    txHash: { type: String, required: true },
    amount: { type: Number, required: true },
    token: { type: String, required: true },
    chain: { type: String, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);