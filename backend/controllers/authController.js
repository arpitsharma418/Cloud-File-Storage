const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const googleAuth = async (req, res) => {
  const { code } = req.body;

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.FRONTEND_URL}/auth/callback`,
        grant_type: "authorization_code",
      },
    );

    const { access_token } = tokenResponse.data;

    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    const { id, name, email, picture } = profileResponse.data;

    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = await User.create({
        googleId: id,
        name,
        email,
        avatar: picture,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error.message);
    res.status(500).json({ message: "Authentication failed" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { googleAuth, getMe };
