// Judge0 API utility for code execution
class Judge0Utils {
    constructor() {
        this.apiUrl = 'https://judge0-ce.p.rapidapi.com/submissions';
        this.apiKey = 'e88e31c027msh9b2a851b19b0f9bp1b4f21jsndf8e8c7b3d99'; // Replace with your actual API key
        this.languageIds = {
            javascript: 63,
            python: 71,
            java: 62,
            cpp: 54
        };
    }

    getLanguageId(language) {
        return this.languageIds[language] || this.languageIds.javascript;
    }

    async submitCode(code, language, input = "") {
        const languageId = this.getLanguageId(language);
        
        const payload = {
            source_code: code,
            language_id: languageId,
            stdin: input
        };

        const response = await fetch(`${this.apiUrl}?base64_encoded=true&wait=false`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': this.apiKey,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.token;
    }

    async getResult(token) {
        const response = await fetch(`${this.apiUrl}/${token}?base64_encoded=true`, {
            headers: {
                'X-RapidAPI-Key': this.apiKey,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Decode base64 output
        if (result.stdout) {
            result.stdout = atob(result.stdout);
        }
        if (result.stderr) {
            result.stderr = atob(result.stderr);
        }
        if (result.compile_output) {
            result.compile_output = atob(result.compile_output);
        }

        return result;
    }

    async executeCode(code, language, input = "") {
        try {
            const token = await this.submitCode(code, language, input);
            
            // Poll for result
            let result;
            let attempts = 0;
            const maxAttempts = 30; // 30 seconds max wait time
            
            do {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                result = await this.getResult(token);
                attempts++;
            } while (result.status?.id <= 2 && attempts < maxAttempts);

            return result;
        } catch (error) {
            console.error('Judge0 execution error:', error);
            throw error;
        }
    }

    wrapCode(code, language, functionCall) {
        let wrappedCode = "";
        
        if (language === "javascript") {
            wrappedCode = `${code}

// Auto-call the function with test case
try {
    const result = ${functionCall};
    console.log(JSON.stringify(result));
} catch (error) {
    console.error(error.message);
}`;
        } else if (language === "python") {
            wrappedCode = `${code}

# Auto-call the function with test case
import json
print(json.dumps(${functionCall}))`;
        } else if (language === "java") {
            // Extract the method body from user code
            let methodBody = code.trim();
            
            // Remove 'public' prefix if it exists
            if (methodBody.startsWith('public ')) {
                methodBody = methodBody.replace(/^public\\s+/, '');
            }
            
            // Ensure it has public static prefix
            if (!methodBody.startsWith('static ')) {
                methodBody = 'public static ' + methodBody;
            } else {
                methodBody = 'public ' + methodBody;
            }
            
            // For problems that return arrays, use Arrays.toString()
            const needsArraysToString = functionCall.includes('twoSum') || functionCall.includes('addTwoNumbers') || functionCall.includes('reverseList');
            const printStatement = needsArraysToString ? `Arrays.toString(${functionCall})` : `${functionCall}`;
            
            wrappedCode = `import java.util.*;

public class Main {
    ${methodBody}
    
    public static void main(String[] args) {
        try {
            System.out.println(${printStatement});
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}`;
        } else if (language === "cpp") {
            wrappedCode = `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <sstream>
using namespace std;

// Helper function to print vectors
template<typename T>
void printVector(const vector<T>& vec) {
    cout << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        cout << vec[i];
        if (i < vec.size() - 1) cout << ",";
    }
    cout << "]";
}

${code}

int main() {
    try {
        auto result = ${functionCall};
        
        // Handle different return types
        if constexpr (std::is_same_v<decltype(result), vector<int>>) {
            printVector(result);
        } else {
            cout << result;
        }
        cout << endl;
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
    }
    return 0;
}`;
        }

        return wrappedCode;
    }
}

// Create global instance
window.judge0Utils = new Judge0Utils();