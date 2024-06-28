import express from 'express'
import { validateJwt } from '../../middlewares/auth.js';
import { getAdminDashBoard, getVendorDashBoard } from './controller.js';
const dashBoard = express.Router();

dashBoard.get('/admin', validateJwt, getAdminDashBoard)

dashBoard.get('/vendor', validateJwt, getVendorDashBoard)


export default dashBoard