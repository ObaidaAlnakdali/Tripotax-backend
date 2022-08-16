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
    phoneNumber: {
        type: Number,
    },
    birthdate: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        enum: ["avilable", "unavilable"],
        default: 'avilable'
    },
    personalImage: {
        type: String,
        default: 'user.jpg'
    },
    carImage: [{
        type: String,
    }],
    city: {
        type: Schema.Types.ObjectId,
        ref: 'City',
    },
    rate: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        Rate: Number,
        date: Date,
    }]
}, {
    collection: 'drivers',
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

Model.pre(['find', 'findOne', 'findById'], function () {
    this.populate(['rate.userId', 'city']);
});

Model.virtual('fullName').get(function () {  
    return this.firstName + ' ' + this.lastName;
});

Model.virtual('Rate').get(function () {  
    let sum = 0;
    let length = this.rate.length;
    if (length === 0) return 'N/A';
    this.rate.map(rate => {
        sum += rate.Rate;
    })
    let rate = sum/length;
    return {rate: rate, length: length};
});

module.exports = mongoose.model("Driver", Model);