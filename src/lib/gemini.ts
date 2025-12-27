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
  // If Gemini is not configured, return fallback data instead of throwing
  if (!genAI || !API_KEY) {
    console.warn('Gemini API not configured. Using fallback data extraction.');
    return getFallbackData(text, mode);
  }

  try {
    // Try different model names in order of preference
    // Some API keys may have access to different models
    const modelNames = ['gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];
    
    let lastError: any = null;
    
    // Try each model until one works
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

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
        // This model didn't work, try the next one
        lastError = error;
        console.warn(`Model ${modelName} failed, trying next...`, error.message);
        continue;
      }
    }
    
    // If all models failed, throw the last error (but we'll catch it and return fallback)
    throw lastError || new Error('All Gemini models failed');
  } catch (error: any) {
    console.error('Error extracting profile from text:', error);
    
    // Return a fallback response instead of throwing
    // This allows the app to continue working even if Gemini fails
    console.warn('Gemini API failed, returning fallback data. User can still use the app.');
    
    return getFallbackData(text, mode);
  }
}

/**
 * Fallback data extraction when Gemini is unavailable
 */
function getFallbackData(text: string, mode: 'seeker' | 'employer'): any {
  if (mode === 'seeker') {
    return {
      bio: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
      skills: extractSkillsFromText(text),
      experience: 'Not specified',
      education: 'Not specified',
    };
  } else {
    return {
      description: text.substring(0, 300) + (text.length > 300 ? '...' : ''),
      requirements: extractRequirementsFromText(text),
      salary: 'Not specified',
      type: 'Full-time',
    };
  }
}

/**
 * Simple text extraction helpers as fallback when Gemini fails
 */
function extractSkillsFromText(text: string): string[] {
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'node', 'python', 'java', 'css', 'html',
    'sql', 'mongodb', 'postgresql', 'aws', 'docker', 'kubernetes', 'git',
    'figma', 'design', 'marketing', 'sales', 'management', 'leadership'
  ];
  
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
  
  return foundSkills.length > 0 ? foundSkills : ['See description'];
}

function extractRequirementsFromText(text: string): string[] {
  const requirementPatterns = [
    /(\d+)\+?\s*years?/gi,
    /bachelor/i,
    /master/i,
    /degree/i,
    /experience/i,
    /required/gi
  ];
  
  const requirements: string[] = [];
  const sentences = text.split(/[.!?]/);
  
  sentences.forEach(sentence => {
    if (requirementPatterns.some(pattern => pattern.test(sentence))) {
      const cleanSentence = sentence.trim().substring(0, 100);
      if (cleanSentence.length > 10) {
        requirements.push(cleanSentence);
      }
    }
  });
  
  return requirements.length > 0 ? requirements.slice(0, 5) : ['See description'];
}

