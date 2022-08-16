const mongoose = require('mongoose');
const { Schema } = require("mongoose");
const Model = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    personalImage: {
        type: String,
        default: 'user.jpg'
    },
    orders:[{
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
        }
    }] 
}, {
    collection: 'users',
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

Model.pre(['find', 'findOne', 'findById'], function () {
    this.populate(['orders.orderId']);
});

Model.virtual('fullName').get(function () {  
    return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model("User", Model);