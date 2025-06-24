const { CohereClientV2 } = require("cohere-ai");

class aiServices {
  constructor() {
    this.cohere = new CohereClientV2({
      token: process.env.ACO_API_KEY,
    });
  }

  getIntelligentReviewType(code) {
    if (code.includes("exec(") || code.includes("eval(")) return "security";
    if (code.length > 1000 || code.includes("loop") || code.includes("query"))
      return "performance";
    return "comprehensive";
  }

  getDocTypeAutomatically(code) {
    if (
      code.includes("app.get(") ||
      code.includes("@app.route") ||
      code.includes("Request")
    ) {
      return "api";
    }
    if (
      code.includes("function") ||
      code.includes("def") ||
      code.includes("=>")
    ) {
      return "inline";
    }
    return "comprehensive";
  }

  async reviewCode(code, language = "", reviewType = "auto") {
    const type =
      reviewType === "auto" ? this.getIntelligentReviewType(code) : reviewType;

    const result = await this.detectCodelanguage(code);

    if (result.result.language) {
      language = result.result.language;
    }

    const reviewprompt = {
      comprehensive: `Perform a comprehensive code review for this ${language} code. Analyze:
        1. Code quality and best practices
        2. Security vulnerabilities
        3. Performance issues
        4. Bug detection
        5. Maintainability concerns
        6. Suggestions for improvement
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Provide detailed feedback with specific line references and actionable recommendations.`,

      security: `Focus on security analysis for this ${language} code. Identify:
        1. Security vulnerabilities
        2. Data validation issues
        3. Authentication/authorization flaws
        4. Injection attack vectors
        5. Sensitive data exposure risks
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\``,

      performance: `Analyze performance aspects of this ${language} code:
        1. Time complexity issues
        2. Memory usage optimization
        3. Database query efficiency
        4. Algorithmic improvements
        5. Resource management
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\``,
    };

    console.log(
      `Programming language is: ${language} and review Type is ${type}`
    );

    try {
      const response = await this.cohere.chat({
        model: "command-a-03-2025",
        messages: [
          {
            role: "system",
            content:
              "You are an expert code reviewer with 15+ years of experience. Provide detailed, actionable feedback.",
          },
          {
            role: "user",
            content: reviewprompt[type] || reviewprompt.comprehensive,
          },
        ],
      });

      console.log(response.message.content[0].text);

      return {
        success: true,
        review: response.message.content[0].text,
        language,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("AI Review Error:", error);
      return {
        success: false,
        error: "Failed to generate code review",
        details: error.message,
      };
    }
  }

  async generateDocumentation(code, language = "", reviewType = "auto") {
    const docType =
      reviewType === "auto"
        ? this.getDocTypeAutomatically(code, language)
        : reviewType;
    const result = await this.detectCodelanguage(code);

    if (result.result.language) {
      language = result.result.language;
    }

    const docprompt = {
      comprehensive: `Generate comprehensive documentation for this ${language} code:
        1. Overview and purpose
        2. Function/method documentation
        3. Parameter descriptions
        4. Return value explanations
        5. Usage examples
        6. Dependencies and requirements
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\``,

      api: `Generate API documentation for this ${language} code:
        1. Endpoint descriptions
        2. Request/response formats
        3. Authentication requirements
        4. Error handling
        5. Rate limiting information
        6. Example requests/responses
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\``,

      inline: `Generate inline code comments and documentation for this ${language} code:
        1. Add meaningful comments
        2. Explain complex logic
        3. Document function parameters
        4. Add JSDoc/similar format comments
        5. Explain algorithms and data structures
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\``,
    };

    try {
      const response = await this.cohere.chat({
        model: "command-a-03-2025",
        messages: [
          {
            role: "system",
            content:
              "You are a technical documentation expert. Create clear, comprehensive documentation.",
          },
          {
            role: "user",
            content: docprompt[docType] || docprompt.comprehensive,
          },
        ],
      });

      console.log(response.message.content[0].text);

      return {
        success: true,
        review: response.message.content[0].text,
        language,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("AI Review Error:", error);
      return {
        success: false,
        error: "Failed to generate documentation",
        details: error.message,
      };
    }
  }

  async analyzeCodeComplexity(code, language = "") {
    const result = await this.detectCodelanguage(code);

    if (result.result.language) {
      language = result.result.language;
    }

    const prompt = `Analyze the complexity of this ${language} code:
1. Cyclomatic complexity
2. Cognitive complexity
3. Maintainability index
4. Code duplication
5. Technical debt indicators
6. Refactoring recommendations

Code:
\`\`\`${language}
${code}
\`\`\`

Provide specific metrics and actionable recommendations.`;

    try {
      const response = await this.cohere.chat({
        model: "command-a-03-2025",
        messages: [
          {
            role: "system",
            content:
              "You are a code analysis expert. Provide detailed complexity analysis with metrics.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      console.log(response.message.content[0].text);

      return {
        success: true,
        review: response.message.content[0].text,
        language,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("AI Review Error:", error);
      return {
        success: false,
        error: "Failed to analyze code complexity",
        details: error.message,
      };
    }
  }

  async suggestCodeFixes(code, language = "") {
    const result = await this.detectCodelanguage(code);

    if (result.result.language) {
      language = result.result.language;
    }
    const prompt = `You are a senior ${language} developer with expertise in code quality and refactoring for large-scale enterprise systems. Analyze the following ${language} code to identify issues (e.g., bugs, performance bottlenecks, readability problems, security vulnerabilities, or non-compliance with best practices). For each issue, provide a specific, actionable fix with a refactored code snippet. Do not analyze cyclomatic complexity, cognitive complexity, maintainability index, code duplication, or technical debt metrics. Focus only on suggesting fixes and refactoring the code.

**Code**:
\`\`\`${language}
${code}
\`\`\`

**Output Format**:
Return a structured JSON object with the following field:
- refactoringSuggestions: [{ issue: string, description: string, priority: string, refactoredCode: string }]

Each suggestion should include:
- issue: A brief name of the problem (e.g., "Nested Logic", "Hardcoded Value").
- description: A detailed explanation of the issue and why it needs fixing.
- priority: "High", "Medium", or "Low" based on impact.
- refactoredCode: A complete, refactored code snippet fixing the issue.

Ensure suggestions are practical, align with ${language} best practices (e.g., Airbnb style guide for JavaScript, PEP 8 for Python), and are suitable for enterprise-grade systems. Provide precise fixes with code examples, avoiding generic advice. If no issues are found, return an empty refactoringSuggestions array.`;

    try {
      const response = await this.cohere.chat({
        model: "command-a-03-2025",
        messages: [
          {
            role: "system",
            content: `You are a senior ${language} developer. Refactor the code and fix any issues found`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      console.log(response.message.content[0].text);

      return {
        success: true,
        review: response.message.content[0].text,
        language,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("AI Review Error:", error);
      return {
        success: false,
        error: "Failed to analyze code complexity",
        details: error.message,
      };
    }
  }

  async detectCodelanguage(code) {
    const prompt = `You are an expert in programming languages with experience in large-scale enterprise systems. Analyze the following code snippet to determine its programming language. Consider syntax, keywords, structure, and common patterns to make an accurate identification. Provide the result in a structured JSON object.

**Code**:
\`\`\`
${code}
\`\`\`

**Output Format**:
Return a structured JSON object with the following fields:
- language: string (e.g., "JavaScript", "Python", "Java")
- confidence: number (0 to 1, indicating confidence in the detection)
- details: string (brief explanation of how the language was identified)

**Supported Languages**:
Include at least the following: JavaScript, TypeScript, Python, Java, C++, C#, Go, Ruby, PHP, HTML, CSS, SQL, Shell, Rust, Kotlin, Swift.

**Instructions**:
- Use syntactic clues (e.g., "function" for JavaScript, "def" for Python, "public class" for Java).
- Handle edge cases (e.g., short snippets, mixed languages) by prioritizing the dominant language.
- If the language cannot be determined, return "Unknown" with a confidence of 0 and explain why.
- Ensure the response is precise and suitable for enterprise-grade tools.

Example:
For code "function add(a, b) { return a + b; }", return:
{
  "language": "JavaScript",
  "confidence": 0.95,
  "details": "Detected 'function' keyword and curly brace syntax typical of JavaScript."
}`;

    try {
      const response = await this.cohere.chat({
        model: "command-a-03-2025",
        messages: [
          {
            role: "system",
            content: `You are an expert in identifying programming languages based on code syntax.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      console.log(response.message.content[0].text);

      let rawText = response.message.content[0].text.trim();

      // Try to extract JSON from a markdown block using regex
      const match = rawText.match(/```json\s*([\s\S]*?)```/);

      if (!match || !match[1]) {
        throw new Error("Could not extract JSON from AI response");
      }

      let result = JSON.parse(match[1]);

      return {
        success: true,
        result: {
          language: result.language,
          confidence: result.confidence,
          details: result.details,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("AI Review Error:", error);
      return {
        success: false,
        error: "Failed to analyze code complexity",
        details: error.message,
      };
    }
  }
}

module.exports = new aiServices();
