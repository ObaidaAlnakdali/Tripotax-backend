const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const Model = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        refPath: 'senderRef',
        require: true
    },
    senderRef: {
        type: String,
        enum: ['User', 'Driver'],    
    },
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    content: {
        type: String,
        require: true
    }
}, {
    collection: 'messages',
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

Model.pre(['find', 'findOne'], function () {
    this.populate(['sender']);
});

module.exports = mongoose.model("Message", Model);