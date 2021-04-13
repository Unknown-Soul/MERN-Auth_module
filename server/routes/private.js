import express from 'express';
import {HomeScreen} from '../controllers/HomeScreen.js';
import {protect} from '../middleware/auth.js';
const router =  express.Router();

console.log("Reached to Private.js");
// router.get('/',protect,HomeScreen);
router.post('/',protect,HomeScreen);
export default router;