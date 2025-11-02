'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Vapi from '@vapi-ai/web'

type AssistantConfig = {
  name: string;
  firstMessage: string;
  transcriber: any;
  voice: any;
  model: any;
}

type VapiComponentProps = {
  assistantConfig: AssistantConfig;
  interviewData: any;
}

type Message = {
  role: 'assistant' | 'user';
  text: string;
  timestamp: Date;
}

export const VapiComponent = ({ assistantConfig, interviewData }: VapiComponentProps) => {
  const router = useRouter();
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<string>('Ready');
  const [volume, setVolume] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const callStartTime = useRef<number>(0);

  // Convex mutation for saving responses
  const saveResponses = useMutation(api.Interview.SaveInterviewResponses);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentTranscript]);

  useEffect(() => {
    // Initialize Vapi
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      setIsCallActive(true);
      setCallStatus('Call started');
      setMessages([]);
      callStartTime.current = Date.now();
      console.log('Call started at:', new Date().toISOString());
    });

    vapiInstance.on('call-end', async () => {
      console.log('=== CALL END EVENT TRIGGERED ===');
      console.log('Interview ID:', interviewData._id);
      console.log('Messages count:', messages.length);
      
      setIsCallActive(false);
      setCallStatus('Call ended - Saving transcript...');
      setIsSaving(true);
      
      // Calculate duration in seconds
      const duration = Math.floor((Date.now() - callStartTime.current) / 1000);
      console.log('Call ended. Duration:', duration, 'seconds');
      
      // Prepare transcript data for saving
      const transcriptData = messages.map(msg => ({
        role: msg.role,
        text: msg.text,
        timestamp: msg.timestamp.getTime()
      }));

      console.log('Saving transcript with', transcriptData.length, 'messages');
      console.log('Transcript data:', transcriptData);

      try {
        // Save transcript to database
        const result = await saveResponses({
          interviewId: interviewData._id,
          transcript: transcriptData,
          duration: duration
        });
        
        console.log('Save result:', result);
        console.log('Transcript saved successfully!');
        setCallStatus('Redirecting to feedback...');
        
        const feedbackUrl = `/interview/${interviewData._id}/feedback`;
        console.log('Redirecting to:', feedbackUrl);
        
        // Redirect to feedback page after a short delay
        setTimeout(() => {
          console.log('Executing redirect now...');
          router.push(feedbackUrl);
        }, 2000);
        
      } catch (error) {
        console.error('Failed to save transcript:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        setCallStatus('Error saving transcript - redirecting anyway...');
        setIsSaving(false);
        
        // Still redirect after error
        const feedbackUrl = `/interview/${interviewData._id}/feedback`;
        console.log('Redirecting after error to:', feedbackUrl);
        
        setTimeout(() => {
          console.log('Executing redirect after error...');
          router.push(feedbackUrl);
        }, 3000);
      }
    });

    vapiInstance.on('speech-start', () => {
      setCallStatus('AI is speaking...');
    });

    vapiInstance.on('speech-end', () => {
      setCallStatus('Listening...');
    });

    vapiInstance.on('volume-level', (level: number) => {
      setVolume(level);
    });

    // Listen for messages from assistant
    vapiInstance.on('message', (message: any) => {
      console.log('Message received:', message);
      
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage: Message = {
          role: message.role === 'assistant' ? 'assistant' : 'user',
          text: message.transcript,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setCurrentTranscript('');
        
        console.log('Added message:', newMessage.role, '-', newMessage.text.substring(0, 50));
      } else if (message.type === 'transcript' && message.transcriptType === 'partial') {
        if (message.role === 'user') {
          setCurrentTranscript(message.transcript);
        }
      }
    });

    vapiInstance.on('error', (error: any) => {
      console.error('Vapi error:', error);
      setCallStatus('Error occurred');
    });

    return () => {
      vapiInstance.stop();
    };
  }, [interviewData._id, router]);

  // Update the dependency to re-save when messages change
  useEffect(() => {
    console.log('Current message count:', messages.length);
  }, [messages]);

  const startCall = async () => {
    if (!vapi) return;

    try {
      await vapi.start(assistantConfig);
      setCallStatus('Connecting...');
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('Failed to start');
    }
  };

  const endCall = () => {
    if (!vapi) return;
    vapi.stop();
    setCallStatus('Ending call...');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Panel - Voice Interface */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 h-full min-h-[600px]">
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {/* Microphone Icon with volume indicator */}
          <div className="relative">
            <div 
              className={`w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                isCallActive ? 'scale-110' : ''
              }`}
              style={{
                boxShadow: isCallActive ? `0 0 ${20 + volume * 50}px rgba(59, 130, 246, 0.5)` : 'none'
              }}
            >
              <svg 
                className={`w-16 h-16 text-white ${isCallActive ? 'animate-pulse' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                />
              </svg>
            </div>
            {isCallActive && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                  <div 
                    className="h-full bg-green-400 rounded-full transition-all duration-100"
                    style={{ width: `${volume * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">{assistantConfig.name}</h3>
            <div className="flex items-center justify-center space-x-2">
              {(isCallActive || isSaving) && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
              <p className={`text-lg ${isCallActive || isSaving ? 'text-green-400' : 'text-gray-400'}`}>
                {callStatus}
              </p>
            </div>
            {!isCallActive && !isSaving && (
              <p className="text-sm text-gray-500 mt-2">
                {interviewData?.interviewQuestions?.length || 0} questions prepared for you
              </p>
            )}
            {isSaving && (
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 flex-col">
            {!isCallActive && !isSaving ? (
              <>
                <button 
                  onClick={startCall}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
                >
                  Start Voice Interview
                </button>
                {/* Temporary test button */}
                <button 
                  onClick={() => router.push(`/interview/${interviewData._id}/feedback`)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold text-sm"
                >
                  🧪 Test: Go to Feedback
                </button>
              </>
            ) : !isSaving ? (
              <button 
                onClick={endCall}
                className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                End Interview
              </button>
            ) : (
              <button 
                disabled
                className="px-10 py-4 bg-gray-600 rounded-xl font-semibold shadow-lg text-lg cursor-not-allowed opacity-50"
              >
                Processing...
              </button>
            )}
          </div>

          {/* Instructions */}
          {!isCallActive && !isSaving && (
            <div className="mt-4 p-5 bg-gray-900 rounded-xl w-full border border-gray-700">
              <h4 className="font-semibold mb-3 text-gray-300 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Instructions
              </h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Speak clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Answer each question thoroughly with examples</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>You can end the interview anytime</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Your responses will be analyzed by AI after completion</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Conversation Transcript */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 h-full min-h-[600px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white">Live Transcript</h3>
            <p className="text-xs text-gray-400 mt-1">Real-time conversation display</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {messages.length} messages
            </span>
            {isCallActive && (
              <div className="flex items-center space-x-1">
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Container - Scrollable */}
        <div 
          ref={messagesContainerRef}
          className="custom-scroll flex-1 overflow-y-auto p-6 space-y-4"
          style={{ 
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain'
          }}
        >
          {messages.length === 0 && !isCallActive ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-semibold mb-1">No messages yet</p>
                <p className="text-sm">Start the interview to see the conversation</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex animate-fadeIn ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`flex items-center space-x-2 mb-1 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {message.role === 'assistant' ? (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-xs font-medium text-gray-400">
                        {message.role === 'assistant' ? 'AI Interviewer' : 'You'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div 
                      className={`p-4 rounded-2xl shadow-md ${
                        message.role === 'assistant' 
                          ? 'bg-gradient-to-br from-gray-700 to-gray-750 text-white rounded-tl-sm' 
                          : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Current partial transcript - typing indicator */}
              {currentTranscript && (
                <div className="flex justify-end animate-fadeIn">
                  <div className="max-w-[85%] items-end flex flex-col">
                    <div className="flex items-center space-x-2 mb-1 flex-row-reverse space-x-reverse">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg opacity-70">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-400 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Speaking...
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-br from-blue-600/70 to-blue-700/70 text-white shadow-md border border-blue-500/30">
                      <p className="text-sm leading-relaxed italic">{currentTranscript}</p>
                    </div>
                  </div>  
                </div>
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Status Footer */}
        {(isCallActive || isSaving) && (
          <div className="border-t border-gray-700 p-4 bg-gray-750 flex-shrink-0">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="relative flex items-center">
                  <div className={`w-2 h-2 ${isSaving ? 'bg-blue-500' : 'bg-red-500'} rounded-full animate-pulse`}></div>
                  <div className={`w-2 h-2 ${isSaving ? 'bg-blue-500' : 'bg-red-500'} rounded-full absolute animate-ping`}></div>
                </div>
                <span className="text-gray-300 font-medium">{isSaving ? 'Saving...' : 'Recording'}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">
                  Progress: <span className="text-blue-400 font-semibold">
                    {messages.filter(m => m.role === 'assistant').length} / {interviewData?.interviewQuestions?.length || 0}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}