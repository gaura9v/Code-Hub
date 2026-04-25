const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const { createProblem, updateProblem, deleteProblem, getProblemById , getAllProblem, solvedAllproblembyUser, submittedProblem } = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware")
//create the problem
//fetch the problem
//update the problem
//delete the problem

problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllproblembyUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);

module.exports = problemRouter;