import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
import dotenv from "dotenv";
import UserModel from "./Models/userModel.js";
dotenv.config(); // This loads environment variables from a .env file into process.env

passport.use(
  "google-login",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://tasklist-backend-0u3k.onrender.com/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.use(
    "google-register",
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://tasklist-backend-0u3k.onrender.com/auth/google/register/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await UserModel.findById(id);
//       done(null, user);
//     } catch (error) {
//       done(error, null);
//     }
//   });
