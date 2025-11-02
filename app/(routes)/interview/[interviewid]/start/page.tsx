'use client'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import AppHeader from '../../../_component/AppHeader'
import { VapiComponent } from './components/VapiComponent'
import { Timer, Mic, User } from "lucide-react"
import { InterviewDataContext } from '@/app/context/InterviewDataContext'
import { UserDetailContext } from '@/app/context/UserDetailContext'   

function StartInterview() {
  const params = useParams();
  const interviewid = params?.interviewid as string;
  const [isLoading, setIsLoading] = useState(true);
  const { setInterviewInfo } = useContext(InterviewDataContext);
  const { userDetail } = useContext(UserDetailContext);

  // Query interview data - skip if interviewid is not available
  const interviewData = useQuery(
    api.Interview.GetInterviewQuestions,
    interviewid ? { interviewId: interviewid as Id<"InterviewSessionTable"> } : "skip"
  );

  // Build question list
  const questionsArr = (interviewData?.[0]?.interviewQuestions ?? []) as any[];
  const questionListString = questionsArr
    .map((q: any) => (typeof q === "string" ? q : q?.question ?? ""))
    .filter(Boolean)
    .join("\n");

  // Derived info
  const jobPosition = interviewData?.[0]?.jobTitle ?? "N/A";
  const username = userDetail?.name ?? "Candidate"; // Fixed: use userDetail from context
  const jobDescription = interviewData?.[0]?.jobDescription ?? "No description provided";

  // Assistant configuration
  const assistantConfig = {
    name: "Al'Recruiter",
    firstMessage: `Hi ${username}! I'm Al'Recruiter, your AI interviewer for the ${jobPosition} position. I'll be asking you ${questionsArr.length} questions to assess your skills and experience. Are you ready to begin?`,
    transcriber: {
      provider: "deepgram" as const,
      model: "nova-2", // Fixed: changed from "nova2" to "nova-2"
      language: "en-US",
    },
    voice: {
      provider: "playht" as const,
      voiceId: "jennifer",
    },
    model: {
      provider: "openai" as const,
      model: "gpt-4",
      messages: [
        {
          role: "system" as const,
          content: `
You are an AI voice assistant conducting interviews for ${jobPosition}.
Your job is to ask candidates provided interview questions and assess their responses.

BEGIN WITH THIS EXACT INTRODUCTION:
"Hi ${username}! I'm Al'Recruiter, your AI interviewer for the ${jobPosition} position. I'll be asking you ${questionsArr.length} questions to assess your skills and experience. Are you ready to begin?"

INTERVIEW QUESTIONS TO ASK (one at a time):
${questionListString}

GUIDELINES:
- Ask one question at a time
- Wait for complete responses before proceeding
- Provide brief, encouraging feedback
- Be professional but friendly
- If they struggle, offer to rephrase the question
- After all questions, provide a brief summary
- Keep the conversation natural and engaging

END WITH: "Thank you for completing this interview! Your responses have been recorded and will be reviewed by our team. We'll be in touch soon."

Stay focused on the role: ${jobPosition}
Job description: ${jobDescription}
`.trim(),
        },
      ],
    },
  };

  // Set interview info in context
  useEffect(() => {
    if (interviewData && interviewData.length > 0 && setInterviewInfo) {
      setInterviewInfo({
        jobTitle: interviewData[0]?.jobTitle || null,
        jobDescription: interviewData[0]?.jobDescription || null,
        interviewQuestions: interviewData[0]?.interviewQuestions || [],
        userId: interviewData[0]?.userId || null,
        _id: interviewData[0]?._id || null
      });
    }
  }, [interviewData, setInterviewInfo]);

  // Loading timeout - Fixed: only run when interviewData is available
  useEffect(() => {
    if (interviewData) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [interviewData]);

  if (isLoading || !interviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading Interview Session...</div>
          <p className="text-gray-400 mt-2">Preparing your AI interviewer</p>
        </div>
      </div>
    );
  }

  const currentInterview = interviewData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <AppHeader />
      
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AI Interview Session
            </h1>
            <p className="text-gray-400">Powered by AI Recruiter Technology</p>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Interview Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* AI Recruiter Card */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-gray-400 mb-4">AI Recruiter</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Al'Recruiter</h3>
                    <p className="text-green-400 text-sm flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Online & Ready
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/50">
                  <p className="text-sm text-blue-300">
                    "I'll guide you through {currentInterview?.interviewQuestions?.length || 0} questions for the {jobPosition} role."
                  </p>
                </div>
              </div>

              {/* Job Details Card */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-gray-400 mb-4">Interview Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Timer className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Position</p>
                      <p className="text-lg font-semibold">{currentInterview?.jobTitle || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Description</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {currentInterview?.jobDescription || 'No description provided'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-sm text-gray-400">Total Questions</span>
                    <span className="text-lg font-bold text-blue-400">
                      {currentInterview?.interviewQuestions?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-gray-400 mb-4">Interview Tips</h2>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-2">
                    <Mic className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p>Speak clearly and at a moderate pace</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-400 mt-0.5 flex-shrink-0"></div>
                    <p>Think before you answer - take your time</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 rounded-full border-2 border-purple-400 mt-0.5 flex-shrink-0"></div>
                    <p>Be specific and provide examples from your experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Vapi Integration */}
            <div className="lg:col-span-2">
              <VapiComponent 
                assistantConfig={assistantConfig}
                interviewData={currentInterview}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartInterview