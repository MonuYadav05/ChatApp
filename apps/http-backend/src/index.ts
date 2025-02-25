import express from "express";
import jwt from "jsonwebtoken";
const app = express();
require('dotenv').config();

app.post("/api/signup", (req, res) => {
    res.json({
        userId: 123,
    })
    // zod validation
    // check for already exists in db or not
    // if not then put an entry there

})

app.post("/signin", (req, res) => {
    const userId = 123;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || "");
    res.json({
        token
    })
})

app.post("/room", (req, res) => {
    res.json({
        roomId: 123
    })
})
app.listen(4000, () => {
    console.log("http server is running on 4000");
})
