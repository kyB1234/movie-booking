const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movies',
        required: true
    },
    rating: {
        type: String,
        required: true,
    },
    reviewText: {
        type: String,
        required: true
    },


}, {
    timestamps: true
})
module.exports = mongoose.model('Reviews', reviewSchema);
