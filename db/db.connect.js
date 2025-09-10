const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initDatabase = async () => {
    await mongoose.connect(mongoUri).then(() => {
        console.log("connected to database");
    }).catch((error) => {
        console.log("Error occured connecting to database");
    })
}

module.exports = {initDatabase};