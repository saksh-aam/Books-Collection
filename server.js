const express = require("express");
const app = express();
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3030;

const books = require("./Book/books-route");
const authRoute = require("./User/authentication");

let mongourl = process.env.MONGO_URL
mongoose
    .connect(mongourl)
    .then(() => {
        app.listen(port, () => {
            console.log(`App started on port: ${port}`);
        });
    })
    .catch((err) => console.log("error", err.message));


app.get("/", (req, res) => {
    res.send("hello");
});
app.use("/api/user", authRoute);
app.use("/api", books);