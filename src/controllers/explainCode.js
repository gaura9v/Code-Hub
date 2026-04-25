const explainCode = async (req, res) => {
    try {
        const { code, language, problemTitle, problemDescription } = req.body;

        const systemPrompt = `
You are a strict code explainer.

Your ONLY job is to explain the USER'S CODE.
DO NOT generate a new solution.
DO NOT solve the problem from scratch.

## VERY IMPORTANT RULES:
- Only analyze the given code
- Do NOT ignore the code
- Do NOT provide a different solution
- If code is wrong, explain what it is doing (not fix completely)
- Stick to user's logic

## CONTEXT (for understanding only):
Problem: ${problemTitle}
Description: ${problemDescription}

## TASK:
Explain THIS code:

${code}

## OUTPUT FORMAT (STRICT JSON):
{
  "explanation": "What this code is doing",
  "steps": "Step by step flow",
  "complexity": "Time and space complexity of THIS code",
  "suggestion": "Small improvements only (do NOT rewrite full solution)"
}
`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini", // ✅ better structured output
                messages: [
                    { role: "system", content: systemPrompt },
                    {
                        role: "user",
                        content: `Explain ONLY this code. Do not generate a new solution. ${code}`
                    }
                ]
            })
        });

        const data = await response.json();

        if (!data || !data.choices || data.choices.length === 0) {
            console.error("OpenRouter Error:", data);
            return res.status(500).json({ message: "AI failed", error: data });
        }

        let output = data.choices[0].message.content;

        // ✅ SAFE JSON PARSE (VERY IMPORTANT)
        try {
            output = JSON.parse(output);
        } catch (err) {
            output = {
                explanation: output,
                steps: "",
                complexity: "",
                suggestion: ""
            };
        }

        res.status(200).json(output);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = explainCode;