import express from 'express';
import { getUserData, login, logout, register } from '../Controller/usercontrollerauth.js';
import userAuth from '../Middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.get('/data', userAuth, getUserData);

export default userRouter;