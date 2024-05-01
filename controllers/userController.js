const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/jwtMiddleware");

const registerUser = async (req, res) => {
  try {
    let { password, ...userData } = req.body;

    let user = await User.findOne({
      username: userData.username,
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with given username already exists",
      });
    }
    user = new User({
      ...userData,
      passwordHash: bcrypt.hashSync(password, 10),
    });

    user = await user.save();

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "The user cannot be created" });
    }

    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      try {
        const token = generateToken(user.id);
        res.status(200).json({
          message: "Login successful",
          success: true,
          user: {
            username: user.username,
          },
          token: token,
        });
      } catch (tokenError) {
        res.status(500).send("An error occurred while generating the token.");
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      });
    }
  } catch (error) {
    res;
    res.status(500).json({
      success: false,
      message: "Nom d'utilisateur ou mot de passe incorrect",
    });
    console.log(error);
  }
};

const verifyJwt = (req, res) => {
  res.status(200).json({ success: true, message: "Token is valid" });
};

module.exports = {
  registerUser,
  loginUser,
  verifyJwt,
};
