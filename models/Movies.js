const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,

    },
    movieName: {
        type: String,
        required: true
    },
    genre: [{
        type: String,
        required: true
    }],
    cast: [{
        name: {
            type: String,
            required: true
        },
        asCharacter: {
            type: String,
            required: true
        },
        img: {

            type: String,
            required: true
        }
    }],
    description: {
        type: String,
        required: true,
    },
    images: [{
        mainImg: {
            type: String,
            required: true,
        },
        others: [{
            type: String
        }]
    }],
    releaseDate: {
        type: Date,
        required: true
    },
    language: {
        type: String,
        required: true

    },
    runtimeInSecs: {
        type: Number,
        required: true
    },
    IMDBRating: {
        type: String,
        required: true
    }


}, {
    timestamps: true, _id: true
})
module.exports = mongoose.model('Movie', movieSchema);
