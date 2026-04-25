const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const aiRouter = express.Router();
const solveDoubt=require('../controllers/solveDoubt')
const explainCode=require('../controllers/explainCode')

aiRouter.post('/chat',userMiddleware,solveDoubt);
aiRouter.post('/explain', userMiddleware, explainCode);
module.exports=aiRouter;
