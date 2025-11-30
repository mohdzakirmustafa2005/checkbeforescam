import { GoogleGenAI } from "@google/genai";
import { SecurityReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const scanWebsite = async (url: string): Promise<SecurityReport> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Analyze the safety and reputation of this website URL: "${url}".
    
    You are an advanced cyber-security AI. Your task is to aggregate data from free open-source intelligence resources to detect malicious activity.
    
    Perform the following checks using your search tool:
    1. **Threat Intelligence**: Search for reports on VirusTotal, UrlScan.io, and Google Safe Browsing transparency report for this domain.
    2. **Scam Detection**: Check for scam reports on Trustpilot, Sitejabber, Reddit, and fraud-prevention forums.
    3. **Domain Forensics**: Identify the domain creation date (Domain Age) and hosting provider. Recent creation dates are high risk.
    4. **Technical Security**: Check for valid SSL certificates and server location reputation.
    
    Based on your findings, generate a JSON object.
    
    IMPORTANT: You must return the result strictly as a valid JSON object inside a markdown code block (e.g., \`\`\`json ... \`\`\`).
    
    The JSON structure must be:
    {
      "score": number, // 0 to 100 (100 is very safe, 0 is very dangerous)
      "riskLevel": "Safe" | "Suspicious" | "Dangerous",
      "summary": "A concise 2-3 sentence summary citing specific sources if found (e.g., 'Clean on VirusTotal' or 'Flagged by users').",
      "details": {
        "hosting": "Details about hosting/server or 'Unknown'",
        "ssl": "Details about SSL status or 'Unknown'",
        "domainAge": "Estimated creation date or age or 'Unknown'",
        "blacklist": "Status regarding blacklists (e.g., 'Clean on major lists', 'Listed on X')"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // tools: [{ googleSearch: {} }], // Enable search for real-time data
        // Note: Using search prevents responseMimeType: 'application/json', so we parse manually.
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract JSON from code block
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    let report: SecurityReport;

    if (jsonMatch && jsonMatch[1]) {
      report = JSON.parse(jsonMatch[1]);
    } else {
      // Fallback if model fails to format json (rare with this prompt)
      console.warn("Could not parse JSON from Gemini response, using fallback.");
      report = {
        score: 50,
        riskLevel: 'Suspicious',
        summary: "Could not automatically parse the detailed security report. Please verify the site manually.",
        details: {
          hosting: "Unknown",
          ssl: "Unknown",
          domainAge: "Unknown",
          blacklist: "Check manually"
        }
      };
    }

    // Extract grounding URLs if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        const urls: string[] = [];
        chunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
                urls.push(chunk.web.uri);
            }
        });
        report.groundingUrls = [...new Set(urls)]; // Unique URLs
    }

    return report;

  } catch (error) {
    console.error("Gemini Scan Error:", error);
    throw new Error("Failed to scan website. Please try again.");
  }
};