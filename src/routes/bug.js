const express = require("express");
const bugRouter = express.Router();

const userMiddleware = require("../middleware/userMiddleware");
const {
  getAllBugProblems,
  getBugProblemById
} = require("../controllers/bugController");

// Bug Injection homepage
bugRouter.get("/problems", userMiddleware, getAllBugProblems);

// Bug Injection problem page
bugRouter.get("/problemById/:id", userMiddleware, getBugProblemById);

module.exports = bugRouter;
