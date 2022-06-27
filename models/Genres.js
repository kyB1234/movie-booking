const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true,
    }, images: {
        type: String, required: true,
    },
});
module.exports = mongoose.model("Genres", genreSchema);