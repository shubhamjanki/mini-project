// lib/geminiEvaluation.ts
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
});

export interface TranscriptEntry {
  role: string;
  text: string;
  timestamp?: number;
}

export interface EvaluationResult {
  overallScore: number;
  scores: {
    category: string;
    score: number;
    maxScore: number;
    feedback: string;
  }[];
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  summary: string;
}

export async function evaluateInterview(
  transcript: TranscriptEntry[],
  jobTitle: string,
  jobDescription: string,
  questions: string[]
): Promise<EvaluationResult> {
  try {
    console.log('Starting evaluation with:', {
      transcriptLength: transcript.length,
      jobTitle,
      questionsCount: questions.length
    });

    // Format transcript for analysis - group Q&A pairs
    const qaPairs: { question: string; answer: string }[] = [];
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      // Find the user's answer after this question
      const candidateResponses = transcript
        .filter(entry => entry.role === 'user')
        .map(entry => entry.text);
      
      qaPairs.push({
        question: question,
        answer: candidateResponses[i] || 'No answer provided'
      });
    }

    console.log('Q&A Pairs:', qaPairs);

    const prompt = `
You are an expert HR interviewer evaluating a candidate's interview performance for the position of ${jobTitle}.

JOB DESCRIPTION:
${jobDescription}

INTERVIEW QUESTIONS AND ANSWERS:
${qaPairs.map((qa, i) => `
Question ${i + 1}: ${qa.question}
Candidate's Answer: ${qa.answer}
`).join('\n')}

Analyze this interview thoroughly and provide a detailed evaluation in JSON format.

EVALUATION CRITERIA:
1. Technical Knowledge (0-100): Accuracy and depth of technical responses
2. Communication Skills (0-100): Clarity, articulation, and structure of answers
3. Problem Solving (0-100): Logical thinking and approach to challenges
4. Experience Relevance (0-100): How well past experience aligns with the role
5. Confidence & Clarity (0-100): Delivery confidence and response conciseness

Respond ONLY with valid JSON in this exact format (no markdown, no additional text):
{
  "overallScore": 85,
  "scores": [
    {
      "category": "Technical Knowledge",
      "score": 88,
      "maxScore": 100,
      "feedback": "Demonstrated strong understanding of core concepts. Good examples provided."
    },
    {
      "category": "Communication Skills",
      "score": 82,
      "maxScore": 100,
      "feedback": "Clear and articulate responses. Could improve on structuring longer answers."
    },
    {
      "category": "Problem Solving",
      "score": 85,
      "maxScore": 100,
      "feedback": "Showed logical thinking and systematic approach to problems."
    },
    {
      "category": "Experience Relevance",
      "score": 80,
      "maxScore": 100,
      "feedback": "Relevant experience shared. Could provide more specific examples."
    },
    {
      "category": "Confidence & Clarity",
      "score": 90,
      "maxScore": 100,
      "feedback": "Confident delivery with clear explanations throughout."
    }
  ],
  "strengths": [
    "Strong technical foundation in ${jobTitle} concepts",
    "Clear communication and articulation",
    "Good problem-solving approach"
  ],
  "improvements": [
    "Provide more specific real-world examples",
    "Elaborate on project details",
    "Structure longer answers better"
  ],
  "detailedFeedback": "The candidate demonstrated solid understanding of the role requirements. Their responses showed good technical knowledge and clear communication. They provided relevant examples and showed enthusiasm for the position. Areas for improvement include providing more detailed examples and better structuring of complex answers.",
  "summary": "Strong candidate with good technical skills and communication abilities. Recommended for next round."
}

Be specific, honest, and constructive. Base your evaluation ONLY on the actual answers provided.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    const text = response.text;
    console.log('Raw Gemini response:', text);

    // Extract JSON from response
    let jsonText = text.trim();
    
    // Remove markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    console.log('Cleaned JSON text:', jsonText);

    const evaluation: EvaluationResult = JSON.parse(jsonText);
    
    console.log('Parsed evaluation:', evaluation);

    // Validate the response
    if (!evaluation.overallScore || !Array.isArray(evaluation.scores)) {
      throw new Error('Invalid evaluation format received from AI');
    }

    return evaluation;

  } catch (error) {
    console.error('Error evaluating interview with Gemini:', error);
    
    // Return fallback evaluation if AI fails
    return {
      overallScore: 75,
      scores: [
        {
          category: 'Technical Knowledge',
          score: 75,
          maxScore: 100,
          feedback: 'Unable to generate detailed feedback. Please try again or check your API key.'
        },
        {
          category: 'Communication Skills',
          score: 75,
          maxScore: 100,
          feedback: 'Unable to generate detailed feedback. Please try again or check your API key.'
        },
        {
          category: 'Problem Solving',
          score: 75,
          maxScore: 100,
          feedback: 'Unable to generate detailed feedback. Please try again or check your API key.'
        },
        {
          category: 'Experience Relevance',
          score: 75,
          maxScore: 100,
          feedback: 'Unable to generate detailed feedback. Please try again or check your API key.'
        },
        {
          category: 'Confidence & Clarity',
          score: 75,
          maxScore: 100,
          feedback: 'Unable to generate detailed feedback. Please try again or check your API key.'
        }
      ],
      strengths: ['Interview completed successfully'],
      improvements: ['Please retry evaluation for detailed feedback'],
      detailedFeedback: 'Unable to generate AI evaluation. Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      summary: 'Evaluation temporarily unavailable. Please check console for details.'
    };
  }
}