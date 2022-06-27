const express = require('express');
require("dotenv").config({path: "./.env"});


const initDatabase = require("./config/database");
const initMiddleware = require("./config/middleware");
const initRoutes = require("./routes/main");

const app = express();
const port = process.env.PORT || 3000;

initDatabase().then(r => {
    initMiddleware(app);
    initRoutes(app);

    app.listen(port, () => {
        console.log(`Server is up and running on port ${port} `);
    });
}).catch(err =>
    app.use((req, res, next) => {
        res.render('error');
    })
)



