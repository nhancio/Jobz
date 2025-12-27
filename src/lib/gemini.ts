import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. Gemini features will not work.');
}

// Initialize Gemini AI
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Extracts structured profile data from text using Gemini AI
 * @param text - The input text (from voice or manual input)
 * @param mode - 'seeker' for job seeker profiles, 'employer' for job postings
 * @returns Structured profile data
 */
export async function extractProfileFromText(
  text: string,
  mode: 'seeker' | 'employer'
): Promise<any> {
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  try {
    // Use gemini-1.5-flash (faster and more cost-effective) or gemini-1.5-pro (better quality)
    // gemini-pro is deprecated - use gemini-1.5-flash or gemini-1.5-pro instead
    // Available models: gemini-1.5-flash, gemini-1.5-pro, gemini-pro-1.5
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = mode === 'seeker'
      ? `Extract structured information from the following job seeker profile description. Return a JSON object with the following structure:
{
  "bio": "A brief professional bio (2-3 sentences)",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": "Years of experience or experience level",
  "education": "Educational background if mentioned"
}

Text: ${text}

Return ONLY valid JSON, no additional text or markdown formatting.`

      : `Extract structured information from the following job posting description. Return a JSON object with the following structure:
{
  "description": "A detailed job description (2-3 paragraphs)",
  "requirements": ["requirement1", "requirement2", "requirement3"],
  "salary": "Salary range if mentioned",
  "type": "Full-time, Part-time, Contract, etc."
}

Text: ${text}

Return ONLY valid JSON, no additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean the response - remove markdown code blocks if present
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Parse JSON response
    const profileData = JSON.parse(cleanedText);

    // Ensure arrays exist
    if (mode === 'seeker') {
      return {
        bio: profileData.bio || 'No bio provided.',
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        experience: profileData.experience || 'Not specified',
        education: profileData.education || 'Not specified',
      };
    } else {
      return {
        description: profileData.description || 'No description provided.',
        requirements: Array.isArray(profileData.requirements) ? profileData.requirements : [],
        salary: profileData.salary || 'Not specified',
        type: profileData.type || 'Full-time',
      };
    }
  } catch (error: any) {
    console.error('Error extracting profile from text:', error);
    
    // Provide helpful error message with model suggestions
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      throw new Error(
        `Gemini model not available. The model 'gemini-1.5-flash' may not be accessible with your API key. ` +
        `Try updating the model name in src/lib/gemini.ts to 'gemini-1.5-pro' or check your API key permissions. ` +
        `Original error: ${error.message}`
      );
    }
    
    throw new Error(`Failed to process text with AI: ${error.message}`);
  }
}

