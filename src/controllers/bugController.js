const Problem = require("../models/problem");

/**
 * GET all Bug Injection problems
 * Used for Bug Injection homepage
 */
const getAllBugProblems = async (req, res) => {
  try {
    const problems = await Problem.find({
      isBugInjection: true
    }).select("_id title difficulty tags");

    res.status(200).send(problems);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

/**
 * GET single Bug Injection problem
 * startCode is treated as BUGGY CODE
 */
const getBugProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({
      _id: id,
      isBugInjection: true
    }).select("_id title description difficulty tags visibleTestCases startCode");

    if (!problem) {
      return res.status(404).send("Bug Injection problem not found");
    }
    res.status(200).json(problem);

  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

module.exports = {
  getAllBugProblems,
  getBugProblemById
};