import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const BugProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeRightTab, setActiveRightTab] = useState('code');

  const editorRef = useRef(null);
  const { problemId } = useParams();

  /* ---------------- Fetch Problem ---------------- */
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);

      const res = await axiosClient.get(`/bug/problemById/${problemId}`);

      const initialCode =
        res.data.startCode.find(sc => sc.language === langMap[selectedLanguage])
          .initialCode;

      setProblem(res.data);
      setCode(initialCode);
      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  /* ---------------- Change language ---------------- */
  useEffect(() => {
    if (problem) {
      const initialCode =
        problem.startCode.find(sc => sc.language === langMap[selectedLanguage])
          .initialCode;

      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  /* ---------------- Run ---------------- */
  const handleRun = async () => {
    setLoading(true);
    const res = await axiosClient.post(`/submission/run/${problemId}`, {
      code,
      language: selectedLanguage
    });

    setRunResult(res.data);
    setLoading(false);
    setActiveRightTab('testcase');
  };

  /* ---------------- Fix Bug (Submit) ---------------- */
  const handleFixBug = async () => {
    setLoading(true);

    const res = await axiosClient.post(`/submission/submit/${problemId}`, {
      code,
      language: selectedLanguage
    });

    setSubmitResult(res.data);
    setLoading(false);
    setActiveRightTab('result');
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'easy') return 'text-green-500';
    if (difficulty === 'medium') return 'text-yellow-500';
    if (difficulty === 'hard') return 'text-red-500';
  };

  if (!problem) return null;

  return (
    <div className="h-screen flex bg-base-100">

      {/* LEFT SIDE — DESCRIPTION ONLY */}
      <div className="w-1/2 p-6 overflow-y-auto border-r">

        <h1 className="text-2xl font-bold mb-3">
          🐞 Bug Injection: {problem.title}
        </h1>

        <div className={`badge ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </div>

        <div className="badge badge-primary ml-2">
          {problem.tags}
        </div>

        <div className="mt-6 whitespace-pre-wrap text-sm">
          {problem.description}
        </div>

        <div className="mt-8">
          <h3 className="font-bold mb-3">Examples</h3>

          {problem.visibleTestCases.map((tc, i) => (
            <div key={i} className="bg-base-200 p-4 rounded mb-3">
              <div><b>Input:</b> {tc.input}</div>
              <div><b>Output:</b> {tc.output}</div>
              <div><b>Explanation:</b> {tc.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE — CODE */}
      <div className="w-1/2 flex flex-col">

        <div className="tabs tabs-bordered">
          <button
            className={`tab ${activeRightTab === 'code' && 'tab-active'}`}
            onClick={() => setActiveRightTab('code')}
          >
            Code
          </button>

          <button
            className={`tab ${activeRightTab === 'testcase' && 'tab-active'}`}
            onClick={() => setActiveRightTab('testcase')}
          >
            Testcase
          </button>

          <button
            className={`tab ${activeRightTab === 'result' && 'tab-active'}`}
            onClick={() => setActiveRightTab('result')}
          >
            Result
          </button>
        </div>

        {activeRightTab === 'code' && (
          <>
            {/* Language Selector */}
            <div className="flex gap-2 p-3 border-b">
              {['javascript', 'java', 'cpp'].map((lang) => (
                <button
                  key={lang}
                  className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'
                    }`}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                </button>
              ))}
            </div>

            {/* Editor */}
            <Editor
              height="75%"
              language={selectedLanguage}
              value={code}
              onChange={(v) => setCode(v)}
              theme="vs-dark"
            />

            {/* Buttons */}
            <div className="p-4 flex gap-3 justify-end">
              <button
                onClick={handleRun}
                className="btn btn-outline"
              >
                Run
              </button>

              <button
                onClick={handleFixBug}
                className="btn btn-primary"
              >
                Fix Bug
              </button>
            </div>
          </>
        )}


        {activeRightTab === 'testcase' && (
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Test Results</h3>

            {runResult ? (
              <div
                className={`alert ${runResult.success ? 'alert-success' : 'alert-error'
                  }`}
              >
                <div className="w-full">

                  {runResult.success ? (
                    <h4 className="font-bold">✅ All test cases passed!</h4>
                  ) : (
                    <h4 className="font-bold">❌ Some test cases failed</h4>
                  )}

                  <p className="text-sm mt-2">
                    Runtime: {runResult.runtime} sec
                  </p>

                  <p className="text-sm mb-4">
                    Memory: {runResult.memory} KB
                  </p>

                  <div className="space-y-2">
                    {runResult.testCases?.map((tc, i) => (
                      <div key={i} className="bg-base-100 p-3 rounded text-xs">
                        <div><b>Input:</b> {tc.stdin}</div>
                        <div><b>Expected:</b> {tc.expected_output}</div>
                        <div><b>Output:</b> {tc.stdout}</div>

                        <div
                          className={
                            tc.status_id === 3
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Click "Run" to test your code.
              </div>
            )}
          </div>
        )}


        {activeRightTab === 'result' && (
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Submission Result</h3>

            {submitResult ? (
              <div
                className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'
                  }`}
              >
                <div>

                  {submitResult.accepted ? (
                    <>
                      <h4 className="font-bold text-lg">🎉 Bug Fixed Successfully</h4>
                      <p className="mt-3">
                        Test Cases Passed: {submitResult.passedTestCases}/
                        {submitResult.totalTestCases}
                      </p>
                      <p>Runtime: {submitResult.runtime} sec</p>
                      <p>Memory: {submitResult.memory} KB</p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-bold text-lg">
                        ❌ {submitResult.error || 'Wrong Answer'}
                      </h4>
                      <p className="mt-3">
                        Test Cases Passed: {submitResult.passedTestCases}/
                        {submitResult.totalTestCases}
                      </p>
                    </>
                  )}

                </div>
              </div>
            ) : (
              <div className="text-gray-500">
                Click "Fix Bug" to submit your solution.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default BugProblemPage;
