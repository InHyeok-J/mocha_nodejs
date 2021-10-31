import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./router/user";

dotenv.config();

const app = express();

if (!process.env.NODE_ENV === "test") {
    app.use(morgan("dev"));
}
app.use(express.json());
app.use("/users", userRouter);

export default app;
