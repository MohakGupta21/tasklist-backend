import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAllTasks } from "./TaskController.js";
import cookie from "cookie";

// Register a new user
export const registerUser = async (req, res) => {
  const { firstname, lastname, password, confirm_password, email } = req.body;
  const existingUser = await UserModel.findOne({email:email});

  if(existingUser){
    res.status(500).json({ message: "Email already registered!" });
  }
  else if (password == confirm_password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      firstname,
      lastname,
      password: hashedPass,
      email,
    });

    try {
      await newUser.save();
      res.status(200).json({ message: "Success!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else res.status(500).json({ message: "passwords do not match" });
};

// Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) res.status(402).json({ error: "Wrong password" });
      else {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;

        const taskList = await getAllTasks(user._id);

        let data = {
          time: Date(),
          tasks: taskList,
          user_email: user.email,
        };

        const token = jwt.sign(data, jwtSecretKey);

        res.status(200).json({ token: token });
      }
    } else {
      res.status(404).json({ error: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signInByGoogle = async (req, res) => {
  if (req.user) {
    // console.log(req.user._json);

    const emailVal = req.user._json.email;
    try {
      const user = await UserModel.findOne({ email: emailVal });

      if (user) {
        // Log in into the account
        let jwtSecretKey = process.env.JWT_SECRET_KEY;

        const taskList = await getAllTasks(user._id);

        let data = {
          time: Date(),
          tasks: taskList,
          user_email: user.email,
        };

        const token = jwt.sign(data, jwtSecretKey);

        // // Set the cookie
        // res.setHeader(
        //   "Set-Cookie",
        //   cookie.serialize("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
        //     sameSite: "strict",
        //     maxAge: 3600, // 1 hour
        //     path: "/",
        //   })
        // );

        // Redirect to the home page
        res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
      } else {
         const msg="User Does Not Exist"
        // res.status(404).json({ error: "User does not exist" });
        res.redirect(
          `${process.env.CLIENT_URL}/login?message=${msg}`
        );
      }
    } catch (error) {
      res.redirect(
        `${process.env.CLIENT_URL}/login?message=${encodeURIComponent(
          error.message
        )}`
      );
    }
  } else {
    const x = "Not Authenticated";
    res.redirect(`${process.env.CLIENT_URL}/login?error=${x}`);
  }
};

export const registerByGoogle = async (req, res) => {
  if (req.user) {
    // console.log("Inside register!!");
    // console.log(req.user._json);
    const { given_name, family_name, email, sub } = req.user._json;

    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      const msg = "Email Already Registered";
      res.redirect(
        `${process.env.CLIENT_URL}/signup?message=${msg}`
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(sub, salt);

      const newUser = new UserModel({
        firstname: given_name,
        lastname: family_name,
        password: hashedPass,
        email: email,
      });

      try {
        await newUser.save();
        // res.status(200).json({ message: "Success!" });
        return signInByGoogle(req, res);
      } catch (error) {
        // res.status(500).json({ message: error.message });
        res.redirect(
          `${process.env.CLIENT_URL}/signup?message=${error.message}`
        );
      }
    }
  } else {
    // res.status(400).json({message:"Bad Request"});
    res.redirect(`${process.env.CLIENT_URL}/signup?message=Bad Request`);
  }
};
