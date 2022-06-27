const {registration, checkUserByEmailPassword} = require("../data/auth/auth")
const {seatSelectionHandler} = require("../data/seat/seat");
const QRCode = require('qrcode')

const {showPayDetails, bookTicket} = require("../data/checkout/checkout");
const {getAllMovies, getFilteredMovies} = require("../data/movies/movies");
const {getLandingPage} = require("../data/home/home");
const {theaterInfo} = require("../data/theater/theater");
const {getMovieScheduled} = require("../data/moviescreen/moviescreen");

const movies = require("../models/Movies");
const movieScreens = require("../models/MovieScreens");
const theater = require("../models/Theatre");
let mongoose = require('mongoose');
const ip = require("ip");
const {ObjectId} = require("mongodb");

module.exports.setUser = (req, res, next) => {
    if (req.session.loggedIn === true) {
        console.log(req.session.user, "plxxxxxx")
        res.locals.userName = req.session.user.firstName
        res.locals.userImg = req.session.user.imageUrl
    }
    // console.log(res)
    next()
}
module.exports.login = function (req, res, next) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('pages/auth/auth', {isLogin: true})
    }

}

module.exports.loginAuth = function (req, res, next) {
    console.log("loginCheck entry 1")
    if (req.session.user) {
        res.redirect('/');
    }
    checkUserByEmailPassword(req, res)

}
module.exports.register = function (req, res, next) {
    if (req.session.newUser === true) {
        res.render('pages/auth/auth', {isLogin: false});
    } else res.redirect('back');
}

module.exports.registerSubmit = (req, res, next) => {
    registration(req, res)
}

module.exports.checkAuth = function (req, res, next) {
    if (req.session.loggedIn === true) {
        next();
    } else {
        req.flash("toastMessage", `You must Sign In to Continue !`);
        res.redirect("back")
    }
}


module.exports.home = async (req, res, next) => {
    res.locals.title = "CMA"
    await getLandingPage(req, res);
};
module.exports.moviesList = async function (req, res, next) {
    res.locals.title = "Movies"
    await getAllMovies(req, res);
};
module.exports.moviesListWithFilters = async function (req, res, next) {
    res.locals.title = "Movies"
    await getFilteredMovies(req, res);
};
module.exports.movies = function (req, res, next) {
    res.locals.title = "Movies"
    res.render('pages/movie/details', {id: req.params.id});
}

module.exports.movieDetail_Info = function (req, res) {

    let movie_Id;
    try {
        const id = req.body.id;
        movie_Id = mongoose.Types.ObjectId(id);
    } catch (error) {
        return res.json({success: false});
    }
    movies.findOne({movieId: movie_Id}, (err, doc) => {
        if (err) return res.json({success: false});
        if (!doc) return res.json({success: false});
        return res.json({success: true, doc});
    });
}

module.exports.movieDetail_Cast = function (req, res) {

    let movie_Id;
    try {
        const id = req.body.id;
        movie_Id = mongoose.Types.ObjectId(id);
    } catch (error) {
        return res.json({success: false});
    }
    movies.findOne({movieId: movie_Id}, (err, doc) => {
        if (err) return res.json({success: false});
        if (!doc) return res.json({success: false});
        const castInfo = doc.cast;
        return res.json({success: true, castInfo});
    });
}

module.exports.movieDetail_Reviews = function (req, res) {
    const id = req.body.id;
    // Temporary Data Only for test
    const reviewInfo = [{
        userImgSrc: '',
        userName: 'User01',
        userReview: 'It was not bad. The movie is a little long but I liked it. The acting was good, the script wasn\'t bad either.'
    }, {
        userImgSrc: '',
        userName: 'User02',
        userReview: 'It was not bad. The movie is a little long but I liked it. The acting was good, the script wasn\'t bad either.'
    }, {
        userImgSrc: '',
        userName: 'User03',
        userReview: 'It was not bad. The movie is a little long but I liked it. The acting was good, the script wasn\'t bad either.'
    }];
    return res.json({success: true, reviewInfo});
}

module.exports.theaterList = function (req, res, next) {
    res.locals.title = "Book"

    res.render('pages/theater/list', {id: req.params.id});
}

module.exports.movieScheduled = async function (req, res, next) {

    try {
        if (Object.keys(req.body).length < 1) throw "Error: movieId not passed";
        if (! ObjectId.isValid(req.body.movieId)) throw "Error: not valid movieId";
        const movieId = req.body.movieId;
        const scheduled = await getMovieScheduled(movieId);
        res.json({scheduled: true})
    }catch (e){
        res.json({scheduled: false} )
    }
}

module.exports.seatSelection = async function (req, res, next) {
    res.locals.title = "Seats"
    await seatSelectionHandler(req, res)
}

module.exports.screenInfo = function (req, res) {
    res.locals.title = "Screen"

    let movie_Id, selectDate;
    try {
        movie_Id = mongoose.Types.ObjectId(req.body.id);
        selectDate = new Date(req.body.selectDate + " 00:00:00 GMT");
    } catch (error) {
        return res.json({success: false});
    }

    movieScreens.findOne({movieId: movie_Id}, (err, doc) => {
        if (err) return res.json({success: false});
        if (!doc) return res.json({success: false});
        let screenInfo = [];
        let screens = doc.screens;
        for (let i = 0; i < screens.length; ++i) {
            let singleScreen = {
                screenId: "", showTimes: []
            };
            let screen = screens[i];
            for (let j = 0; j < screen.showTime.length; ++j) {
                let showTime = screen.showTime[j];
                let date = showTime.date;
                let showTimeTemp = {
                    showTimeId: "", time: ""
                }
                if ((date - selectDate) == 0) {
                    singleScreen.screenId = screens[i].screenId;
                    showTimeTemp.showTimeId = showTime.showTimeId;
                    showTimeTemp.time = showTime.time;
                    singleScreen.showTimes.push(showTimeTemp);
                }
            }
            if (singleScreen.showTimes.length != 0) screenInfo.push(singleScreen);
        }
        if (screenInfo.length == 0) return res.json({success: false});
        return res.json({success: true, screenInfo});
    });
}

module.exports.theaterInfo = async function (req, res) {
    res.locals.title = "Theater"

    try {
        if (Object.keys(req.body).length < 1) throw "Error: less data passed";
        if (! ObjectId.isValid(req.body.screenId)) throw "Error: not valid screenId";
        const screenId = req.body.screenId;
        const theaterObj = await theaterInfo(screenId);

        return res.json({success: true, theaterObj});
    } catch (error) {
        return res.json({success: false});
    }
}

module.exports.checkout = function (req, res, next) {

    res.locals.title = "Pay"

    showPayDetails(req, res)
}

module.exports.ticket = async (req, res, next) => {
    res.locals.title = "Ticket"

    const ticket = await bookTicket(req, res)
    console.log(ticket)
    if (ticket.orderId.toString()) {
        QRCode.toDataURL(`http://${ip.address()}:3000/verify/${ticket.orderId.toString()}`, (err, url) => {
            res.render('pages/checkout/ticket', {url: url, ticket});
        })
    } else {
        req.flash("toastMessage", "Something went wrong");
        req.redirect("/")
    }
}


module.exports.addMovieScreens = function (req, res, next) {
    const {movieId, screens} = req.body;

    const movieScreen = new movieScreens({
        movieId: movieId, screens: screens
    })

    movieScreen.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            req.session.newUser === false;
            console.log("new moviescreen added.");
        }
    })
    res.json({"check": "console log"});
}

module.exports.addTheatre = function (req, res, next) {
    var mongoose = require('mongoose');
    var id = new mongoose.Types.ObjectId().getTimestamp();
    console.log(id)
    const {theatreId, theatreName, location, screens} = req.body;

    const addTheatre = new theater({
        theatreId: theatreId, theatreName: theatreName, location: location, screens: screens
    })
    addTheatre.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            req.session.newUser = false;
            console.log("new theatre added.");
        }
    })
    res.json({"check": "console log"});
}

module.exports.addMovie = function (req, res, next) {
    var mongoose = require('mongoose');
    var id = new mongoose.Types.ObjectId();
    console.log(req.body)
    const {
        movieId, movieName, genre, cast, description, images, releaseDate, language, runtimeInSecs, IMDBRating
    } = req.body;
    const movie = new Movie({
        movieId: movieId,
        movieName: movieName,
        genre: genre,
        cast: cast,
        description: description,
        images: images,
        releaseDate: releaseDate,
        language: language,
        runtimeInSecs: runtimeInSecs,
        IMDBRating: IMDBRating
    })
    movie.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            req.session.newUser === false;

        }
    })
    res.json({"check": "console log"});
}


module.exports.checkTicketStatus = (req, res, next) => {
    if (req.session.checkout === true) {
        next();
    } else {
        res.redirect('/movies', {toastMessage: 'Please select a movie', toastStatus: 'error'});
    }
}

module.exports.logout = (req, res, next) => {
    req.logout();
    req.user = null;
    req.session.user = null;
    req.session.loggedIn = false;
    req.session.isAdmin = false;

    req.flash("toastStatus", "success");
    req.flash("toastMessage", `Thanks for visiting. See you soon`);

    res.redirect("/");
};


