const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const Model = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver'  
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',    
    }
}, {
    collection: 'conversations',
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

Model.pre(['find', 'findOne', 'findById', 'save'], function () {
    this.populate(['driver', 'user', 'messages']);
});

Model.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'conversation'
})

module.exports = mongoose.model("Conversation", Model);