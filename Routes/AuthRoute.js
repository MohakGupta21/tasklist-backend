import express from "express";
import {
  loginUser,
  registerByGoogle,
  registerUser,
  signInByGoogle,
} from "../Controllers/AuthController.js";
import passport from "passport";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config(); // This loads environment variables from a .env file into process.env

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

// router.get("/login/success",signInByGoogle);

// Route for Google login
router.get(
  "/google/callback",
  passport.authenticate("google-login", {
    failureRedirect: "/auth/login/failed",
  }),
  signInByGoogle
);

// Route for Google registration
router.get(
  "/google/register/callback",
  passport.authenticate("google-register", {
    failureRedirect: "/auth/login/failed",
  }),
  registerByGoogle
);

router.get(
  "/google",
  passport.authenticate("google-login", { scope: ["profile", "email"] })
);

router.get(
  "/google/register",
  passport.authenticate("google-register", { scope: ["profile", "email"] })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

// router.get('/',(req,res)=> res.send("Hey There!!!"));

export default router;
