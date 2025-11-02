'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { Id } from '@/convex/_generated/dataModel';

// Define the interview info type
export interface InterviewInfo {
  jobTitle: string | null;
  jobDescription: string | null;
  interviewQuestions: any[];
  userId: string | null;
  _id: Id<"InterviewSessionTable"> | null;
}

// Define the context type
interface InterviewDataContextType {
  interviewInfo: InterviewInfo | null;
  setInterviewInfo: (info: InterviewInfo | null) => void;
}

// Create the context with default values
export const InterviewDataContext = createContext<InterviewDataContextType>({
  interviewInfo: null,
  setInterviewInfo: () => {},
});

// Provider component
interface InterviewDataProviderProps {
  children: ReactNode;
}

export const InterviewDataProvider: React.FC<InterviewDataProviderProps> = ({ children }) => {
  const [interviewInfo, setInterviewInfo] = useState<InterviewInfo | null>(null);

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      {children}
    </InterviewDataContext.Provider>
  );
};