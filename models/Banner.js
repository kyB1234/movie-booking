const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movies",
            required: true,
        },
        image: {
            type: String,
            required: true,
        }
    },
    {timestamps: true}
);
module.exports = mongoose.model("Banner", bannerSchema);
