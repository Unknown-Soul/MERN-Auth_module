import express from 'express';
import {HomeScreen} from '../controllers/HomeScreen.js';
import {protect} from '../middleware/auth.js';
import {targets} from '../controllers/targets.js'
const router =  express.Router();

console.log("Reached to Private.js");
// router.get('/',protect,HomeScreen);
router.post('/',protect,HomeScreen);
router.get('/target',protect,targets);
export default router;