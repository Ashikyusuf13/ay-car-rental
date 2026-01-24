import express from "express";
import {
  getUserData,
  login,
  logout,
  register,
} from "../Controller/usercontrollerauth.js";
import userAuth from "../Middleware/userAuth.js";

const userRouter = express.Router();

// Traditional Auth
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

// Protected
userRouter.get("/data", userAuth, getUserData);

export default userRouter;
