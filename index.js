
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
import AuthRoute from "./Routes/AuthRoute.js";
import TaskRoute from "./Routes/TaskRoute.js";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";
import "./passport.js";
// import "./registerStrategy.js";

// Router

// const passportStategy = require('./passport.js');

const app = express();

app.use(
  cookieSession({
    name:"session",
    keys:["cyberwolve"],
    maxAge:24*60*60*100,
  })
)

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


mongoose
  .connect(process.env.MONGO_DB)
  .then(() => app.listen(process.env.PORT, () => console.log("Listening")))
  .catch((err)=> console.log(err));

// Usage of routes
app.use('/auth',AuthRoute)
app.use('/task',TaskRoute)
