import express from 'express';
import {HomeScreen} from '../controllers/HomeScreen.js';
import {protect} from '../middleware/auth.js';
const router =  express.Router();

router.get('/', protect, HomeScreen);

export default router;