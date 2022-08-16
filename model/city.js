const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const Model = new Schema({
    name: {
        type: String,
    }
}, {
    collection: 'cities',
    timestamps: true,
})

module.exports = mongoose.model("City", Model);