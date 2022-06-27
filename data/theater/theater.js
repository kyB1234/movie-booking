const Theater = require("../../models/Theatre");
const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");

const theaterInfo = async (screenId) => {

    if (! ObjectId.isValid(screenId)) throw "Error: screenId not a valid ObjectId";

    const theaterData = await Theater.aggregate([{"$unwind": "$screens"}, {"$match": {"screens.screenId": ObjectId(screenId)}}]);

    if (!theaterData) throw "Error: theater not found";
    const theaterObj = theaterData[0];

    return {success: true, theaterObj};
};

module.exports = {
    theaterInfo
}