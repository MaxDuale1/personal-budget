const mongoose = require('mongoose');

const BudgetItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    budget: {
        type: Number,
        required: true,
        min: 0
    },
    color: {
        type: String,
        required: true,
        match: /^#[0-9A-Fa-f]{6}$/
        // must be like "#FF0000"
    }
});

module.exports = mongoose.model('BudgetItem', BudgetItemSchema);
