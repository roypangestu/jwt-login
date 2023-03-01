import userModels from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { where } from "sequelize";

//get user
const getUser = async (req, res) => {
  try {
    const users = await userModels.findAll({
      attributes: ["id", "username", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

//register
const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password & confirm password tidak sama" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await userModels.create({
      username: username,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Register berhasil" });
  } catch (error) {
    res.json(error.message);
  }
};

//login
const login = async (req, res) => {
  try {
    //cari user berdasarkan email
    const User = await userModels.findAll({
      where: { email: req.body.email },
    });

    //compare password
    const compare = await bcrypt.compare(req.body.password, User[0].password);
    if (!compare) return res.status(400).json({ msg: "wrong password!" });

    //jika password cocok, constrak satu persatu fieldanya
    const userId = User[0].id;
    const username = User[0].username;
    const email = User[0].email;

    const accessToken = jwt.sign(
      { userId, username, email },
      process.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = jwt.sign(
      { userId, username, email },
      process.env.REFRESH_TOKEN_SECRET
    );

    await userModels.update(
      { refresh_token: refreshToken },
      {
        where: { id: userId },
      }
    );

    //http only cookie yang akan di kirim ke klien
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //cookie expired dalam satu hari
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(400).json({ msg: "email not found!" });
  }
};

//logout
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.sendStatus(204); //no content
    const User = await userModels.findAll({
      where: { refresh_token: refreshToken },
    });
    if (!User) return res.sendStatus(204); //no content
    const userId = User[0].id;
    await userModels.update({ refreshToken: null }, { where: { id: userId } });
    res.clearCookie("refresh_token");
    res.status(200).send("Logout successfuly");
  } catch (error) {
    console.log(error);
  }
};

export default { getUser, register, login, logout };

//rangkuman singkat

//jwt.sign({payload, secret key, opsi}) terdapat 3 parameter
//res.cookie('name cookie',value,{options})
