import express from 'express';
import { getAllCars, getCarById } from '../Controller/CarController.js';

const carRouter = express.Router();

carRouter.get('/', getAllCars);
carRouter.get('/:id', getCarById);

export default carRouter;
