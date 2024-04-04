const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    //Get username, email, password, image
    const { username, email, password } = req.body;

    //check if already existing user
    if (!(username && email && password)) {
      return res.status(400).json("Please provide all the required details.");
    }

    const existingUserwithSameEmail = await User.findOne({ email });
    if (existingUserwithSameEmail) {
      return res.status(400).json("User with same email already exist.");
    }

    const existingUserwithSameUsername = await User.findOne({ username });
    if (existingUserwithSameUsername) {
      return res.status(400).json("User with same username already exist.");
    }

    //encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    //create a new user in the db
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    user.password = undefined;

    //send the response
    res.status(200).json({ message: "User successfully registered!", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    //Get username, email, password, image
    const { username, password } = req.body;

    //check if already existing user
    if (!(username && password)) {
      return res.status(400).json("Please provide all the required details.");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json("User with this username doesn't exist.");
    }

    //comparing the password
    const enteredPassword = await bcrypt.compare(password, user.password);
    if (!enteredPassword) {
      return res.status(400).json("Password is incorrect.");
    }

    //generate the jwt
    const token = jwt.sign(
      { userId: user._id, username: username },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    user.password = undefined;

    //configure cookies
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), //1day
      httpOnly: true,
    };

    //send the response via cookies
    res
      .status(200)
      .cookie("token", token, options)
      .json({ message: "User successfully logged in!", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("User has been logout successfully!");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
