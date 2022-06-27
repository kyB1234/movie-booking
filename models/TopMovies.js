const mongoose = require("mongoose");

const topSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Movies", required: true,
    },
}, {timestamps: true});
module.exports = mongoose.model("TopMovies", topSchema);
