import express from 'express'
import { validateJwt } from '../../middlewares/auth.js';
import { getAdminDashBoard } from './controller.js';
const dashBoard = express.Router();

dashBoard.get('/admin', validateJwt, getAdminDashBoard)



export default dashBoard