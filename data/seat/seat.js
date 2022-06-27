const {ObjectId} = require("mongodb");
const Movie = require("../../models/Movies");
const MovieScreens = require('../../models/MovieScreens');
const Theatre = require("../../models/Theatre");

const seatSelectionHandler = async (req, res) => {

    if (!req.body || Object.keys(req.body).length < 4) {
        console.log('Error: Request body empty || Error: less data passed')
        req.flash('toastMessage', `Invalid request`);
        res.redirect("back")
    } else {
        const {movieId, theatreId, screenId, showTimeId} = req.body;
        /*------------ Error Handling Start ------------*/
        if (!ObjectId.isValid(movieId) || !ObjectId.isValid(theatreId) || !ObjectId.isValid(screenId) || !new Date(showTimeId)) {
            req.flash('toastMessage', `Invalid request`);
            res.redirect("back")
        }
        /*------------ Error Handling End ------------*/ else {
            try {
                const screenInfoObj = await seatSelection(movieId, theatreId, screenId, showTimeId);
                const screenInfo = {
                    layout: screenInfoObj.layout, availability: screenInfoObj.availability
                }

                const theatreInfo = {
                    theatreId: screenInfoObj.theatreId, theatreName: screenInfoObj.theatreName
                }

                const movieDateTime = screenInfoObj.showtime.toString();

                const movieInfo = {
                    screenId: screenId,
                    movieId: screenInfoObj.movieId,
                    movieName: screenInfoObj.movieName,
                    movieImage: screenInfoObj.movieImage,
                    runtime: screenInfoObj.runtime,
                    movieLanguage: screenInfoObj.language,
                    movieDate: movieDateTime,
                    showTimeId: screenInfoObj.showtime,
                    price: screenInfoObj.price
                }

                res.render('pages/theater/seat', {
                    'title': "Seat Selection",
                    'seatInfo': JSON.stringify(screenInfo),
                    'movieInfo': movieInfo,
                    'theatreInfo': theatreInfo
                });
            } catch (e) {
                console.log(e)
                req.flash("Invalid request")
                res.redirect("back")
            }
        }
    }
}
const seatSelection = async (movieId, theatreId, screenId, showTimeId) => {

    /*------------ Error Handling Start ------------*/

    if (!movieId || !theatreId || !screenId || !showTimeId) throw 'Error: all parameters are not passed to the function';

    if (!ObjectId.isValid(movieId)) throw 'Error: movieId is not valid Object ID';
    if (!ObjectId.isValid(theatreId)) throw 'Error: theatreId is not valid Object ID';
    if (!ObjectId.isValid(screenId)) throw 'Error: screenId is not valid Object ID';
    if (!new Date(showTimeId)) throw 'Error: showTimeId is not valid TimeStamp'; //Check Once again

    /*------------ Error Handling End ------------*/

    let movie = await Movie.findOne({movieId: ObjectId(movieId)});
    if (!movie) throw "Error: movie not found";

    let theatre = await Theatre.aggregate([{"$unwind": "$screens"}, {"$match": {"screens.screenId": ObjectId(screenId)}}]);
    if (!theatre) throw "Error: theatre not found";

    let showTime = await MovieScreens.aggregate([{"$unwind": "$screens"}, {"$unwind": "$screens.showTime"}, {
        "$match": {
            $and: [{
                "movieId": ObjectId(movieId),
                "screens.screenId": ObjectId(screenId),
                "screens.showTime.showTimeId": new Date(showTimeId)
            }]
        }
    },]);

    if (!showTime) throw "Error: showTime not found";

    return {
        movieId: movieId,
        movieName: movie.movieName,
        movieImage: movie.images[0].mainImg,
        theatreId: theatreId,
        theatreName: theatre[0].theatreName,
        layout: theatre[0].screens.layout,
        availability: showTime[0].screens.showTime.availability,
        showtime: showTime[0].screens.showTime.showTimeId,
        language: movie.language,
        runtime: movie.runtimeInSecs,
        price: showTime[0].screens.showTime.price
    };
}

module.exports = {
    seatSelectionHandler
}
