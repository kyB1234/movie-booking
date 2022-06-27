const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
        },
        theatreId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theatre',
            required: true
        },
        showTimeId: {
            type: String,
            required: true
        },
        seats: [
            {type: String, required: true}
        ],
        price: {
            type: String,
            required: true
        }

    }
    , {
        _id: false
    })


const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'others']
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    orders: {
        type: [ordersSchema],
        default: null,
        required: false
    }

}, {
    timestamps: true,
    _id: true
})

module.exports = mongoose.model('Users', userSchema);
