import express from "express";
const app = express();
const port = 3000;
import userRoute from "./routes/userRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(userRoute);

app.listen(port, console.log("App listen on port 3000.."));
