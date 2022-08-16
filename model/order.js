const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const Model = new Schema({

    // fix Tybe Date and Time
    date: { 
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        //required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
}, {
    collection: 'orders',
    timestamps: true,
    versionKey: false,
})

module.exports = mongoose.model("Order", Model);