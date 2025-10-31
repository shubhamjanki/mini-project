import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import ImageKit from "imagekit";
import { Questrial } from "next/font/google";
import { NextResponse } from "next/server";
import arcjet, { tokenBucket } from "@arcjet/next"; // Add this import

interface QuestionAnswer {
  question: string;
  answer: string;
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// Add Arcjet configuration
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 5,
      capacity: 10  ,
    }),
  ],
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;
    
    const decision = await aj.protect(req, {
      userId: user.primaryEmailAddress?.emailAddress ?? user.id, // Use user.id as fallback
      requested: 5
    });
    
    console.log("Arcjet decision", decision);
    
    if (decision.reason && 'remaining' in decision.reason && decision.reason.remaining === 0) {
      return NextResponse.json({
        status: 429,
        result: "no free credits try again after 24 hours"
      }, { status: 429 });
    }
    if (file) {
      

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload PDF or Word documents." }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum size is 5MB." }, { status: 400 });
    }

    console.log("Received file:", file.name, file.type, file.size);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer.toString('base64'),
      fileName: `${Date.now()}-${file.name}`,
      folder: '/resume-uploads',
    });

    if (!uploadResponse.url) {
      throw new Error("ImageKit upload failed - no URL returned");
    }

    console.log("Upload successful, calling n8n webhook...");

    // Call n8n webhook
    const n8nResponse = await axios.post('http://localhost:5678/webhook/generate-interview-questions', {
      resumeUrl: uploadResponse.url,
    });

    console.log("N8N response received");
    console.log("Full n8n response structure:", JSON.stringify(n8nResponse.data, null, 2));

    // Debug: Check if the response has the expected structure
    if (!n8nResponse.data) {
      throw new Error("No data in n8n response");
    }

    let responseText: string;
    let questions: QuestionAnswer[] | undefined;

    // Try different possible response structures
    if (typeof n8nResponse.data === 'string') {
      // If the response is directly a string
      responseText = n8nResponse.data;
      console.log("Response is direct string");
    } else if (n8nResponse.data.content?.parts?.[0]?.text) {
      // If the response has the structure from your original example
      responseText = n8nResponse.data.content.parts[0].text;
      console.log("Response has content.parts[0].text structure");
    } else if (n8nResponse.data.text) {
      // If the response has a direct text property
      responseText = n8nResponse.data.text;
      console.log("Response has direct text property");
    } else if (Array.isArray(n8nResponse.data)) {
      // If the response is directly the array
      questions = n8nResponse.data;
      console.log("Response is direct array");
    } else {
      // Log the actual structure for debugging
      console.log("Unexpected response structure. Available keys:", Object.keys(n8nResponse.data));
      throw new Error("Unexpected response structure from n8n webhook");
    }

    // If we haven't set questions yet, parse the responseText
    if (!questions && responseText!) {
      console.log("Raw response text:", responseText);
      
      try {
        const parsed = JSON.parse(responseText);
        console.log("Parsed data type:", typeof parsed);
        console.log("Parsed data:", parsed);

        if (Array.isArray(parsed)) {
          questions = parsed;
        } else if (parsed.questions || parsed.content) {
          // Handle nested structures
          questions = parsed.questions || parsed.content;
        } else {
          questions = [parsed]; // Wrap single object in array
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Raw text that failed to parse:", responseText);
        
        // If it's not JSON, try to extract questions from text
        if (typeof responseText === 'string') {
          // Simple fallback: treat each line as a question
          questions = responseText.split('\n')
            .filter(line => line.trim().length > 0)
            .map((line, index) => ({
              question: line.trim(),
              answer: `This is a generated answer for question ${index + 1}`
            }));
          console.log("Extracted questions from text lines:", questions.length);
        } else {
          throw new Error("Failed to parse response as JSON or text");
        }
      }
    }

    // Validate the questions array
    if (!questions || !Array.isArray(questions)) {
      console.error("Questions is not an array:", questions);
      throw new Error("Questions data is not in expected array format");
    }

    // Validate each question has the required fields
    const validQuestions = questions.filter(q => q && typeof q === 'object');
    
    if (validQuestions.length === 0) {
      console.error("No valid questions found in:", questions);
      throw new Error("No valid questions found in response");
    }

    // Ensure each question has question and answer properties
    const finalizedQuestions = validQuestions.map((q, index) => ({
      question: q.question || `Question ${index + 1}`,
      answer: q.answer || `Answer for question ${index + 1}`
    }));

    console.log(`Successfully processed ${finalizedQuestions.length} questions`);

    // Log sample questions for debugging
    finalizedQuestions.slice(0, 3).forEach((item: QuestionAnswer, index: number) => {
      console.log(`Sample Question ${index + 1}:`, item.question.substring(0, 100) + "...");
      console.log(`Sample Answer ${index + 1}:`, item.answer.substring(0, 100) + "...");
    });

    // Return both upload info and questions
    return NextResponse.json({ 
      success: true,
      uploadInfo: {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId 
      },
      questions: finalizedQuestions,
      count: finalizedQuestions.length
    });
  }else{
    const result = await axios.post('http://localhost:5678/webhook/generate-interview-questions', {
      resumeUrl: null,  
      jobTitle: jobTitle,
      jobDescription: jobDescription
    });
    console.log(result.data);
    
    // Parse the questions from the response
    let questions: QuestionAnswer[];
    const responseText = result.data.content?.parts?.[0]?.text || result.data;
    
    try {
      questions = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
    } catch (e) {
      console.error("Failed to parse questions:", e);
      questions = [];
    }
    
    return NextResponse.json({
      success: true,
      questions: questions,
      resumeUrl: null,
      jobTitle: jobTitle,  // Add this
      jobDescription: jobDescription  // Add this
    });
  }
  
  } catch (error: any) {
    console.error("Error in POST handler:", error);
    
    // More specific error messages
    let errorMessage = "Internal server error";
    let statusCode = 500;

    if (error.response?.status === 404) {
      errorMessage = "N8N webhook endpoint not found";
      statusCode = 502;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "Cannot connect to n8n service";
      statusCode = 503;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: statusCode }
    );
  }
}