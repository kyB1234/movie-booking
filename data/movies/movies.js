const Movies = require("../../models/Movies");
const {getGenres, getLanguages} = require("../home/home");

const getAllMovies = async (req, res) => {
    let movies = await Movies.find({});
    if (movies) {
        const genreMovies = await getGenres();
        const langFilter = await getLanguages();
        res.status(200).render("pages/movie/list", {
            movies, genreMovies, langFilter, clearFilters: true,
        });
    } else {
        req.flash("toastMessage", `Something went wrong`);
        res.redirect("back");
    }
};
const getFilteredMovies = async (req, res) => {
    let filters = req.body.filters;
    if (!filters) {
        req.flash("toastMessage", "Invalid request");
        res.redirect("back");
    } else {
        filters = JSON.parse(filters);
        console.log(filters, typeof filters, !filters.language, !filters.genre, "this is it");
        if (!("language" in filters) || !("genre" in filters)) {
            req.flash("toastMessage", "Invalid request");
            res.redirect("back");
        } else {
            const languageFilter = filters.language;
            const genreFilter = filters.genre;
            console.log(languageFilter, genreFilter, "this is it");
            let movies = await Movies.find({});
            if (languageFilter && languageFilter.length > 0) {
                movies = movies.filter((movie) => {
                    let language = movie.language.split(",").map((lang) => lang.trim());

                    let common = language.filter((x) => languageFilter.indexOf(x) !== -1);
                    console.log(language, languageFilter, language.includes(languageFilter), languageFilter.includes(languageFilter), common);
                    return common && common.length > 0;
                });
            }

            console.log(movies, "this is it");

            if (movies) {
                let finalMovie = [];
                if (genreFilter && genreFilter.length > 0) {
                    movies.forEach((movie) => {
                        if (movie.genre) {
                            let genre = movie.genre.map(gen => gen.trim())
                            let common = genreFilter.filter((value) => genre.includes(value));
                            if (common && common.length > 0) {
                                finalMovie.push(movie);
                            }
                        }
                    });
                } else {
                    finalMovie = movies;
                }

                const genreMovies = await getGenres();
                const langFilter = await getLanguages();
                const sendParams = {
                    movies: finalMovie, genreMovies, langFilter, filters: JSON.stringify(filters),
                };
                console.log(sendParams);
                res.status(200).render("pages/movie/list", sendParams);
            } else {
                req.flash("toastMessage", `Invalid request`);
                res.redirect("back");
            }
        }
    }
};

module.exports = {
    getAllMovies, getFilteredMovies,
};