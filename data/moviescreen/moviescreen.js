const MovieScreens = require('../../models/MovieScreens');

const {ObjectId} = require("mongodb");

const getMovieScheduled = async (movieId) => {

    if (! ObjectId.isValid(movieId)) throw "Error: moviedId is not a valid Object id";

    let movie = await MovieScreens.findOne({movieId: ObjectId(movieId)});

    if (!movie) throw "movie has not been scheduled for theaters";

    return true;
}

module.exports = {
    getMovieScheduled
}