const staticRoutes = require('./static');
const userRoutes = require('./user');
const detailsRoutes = require('./details');
const theaterRoutes = require('./theater');
const verifyRoutes = require('./verify');
const initRoutes = function (app) {
    console.log("Initializing Routes...");

    app.use('/', staticRoutes); // Static + Home + Auth
    app.use('/verify', verifyRoutes); // Users
    app.use('/users', userRoutes); // Users
    app.use('/details', detailsRoutes); //Details
    app.use('/theater', theaterRoutes); // Theater

    app.use("*", (req, res) => {
        res.render('pages/error/notFound');

    })
    // Ending Routes
    console.log('Finished Initializing Routes...');
}

module.exports = initRoutes;
