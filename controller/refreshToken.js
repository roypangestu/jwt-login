import userModels from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) res.sendStatus(401);
    const User = await userModels.findAll({
      where: { refresh_token: refreshToken },
    });
    if (!User[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) return res.sendStatus(403);
        const userId = User[0].id;
        const username = User[0].username;
        const email = User[0].email;
        const accessToken = jwt.sign(
          { userId, username, email },
          process.env.ACCESS_TOKEN_SECRET
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
