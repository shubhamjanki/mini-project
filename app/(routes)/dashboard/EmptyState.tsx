import React from 'react';
import { Button } from '@/components/ui/button';
import CreateInterviewDialogbox from '../_component/CreateInterviewDialogbox';
import Link from 'next/link';

const EmptyState: React.FC = () => {
  return (
    <div className="w-full mt-14 mx-auto  p-8 flex flex-col items-center gap-6
                    bg-white/6 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
      <div className="w-[96px] h-[96px] flex items-center justify-center rounded-full bg-white/8 border border-white/10">
        <img
          src="/interview.png"
          alt="No interviews"
          className="w-20 h-20 object-contain"
        />
      </div>

      <h2 className="text-xl font-semibold text-white">No interviews yet</h2>
      <p className="text-center text-sm text-white/75 max-w-md">
        Create your first AI-powered mock interview to practice, get feedback, and improve.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <CreateInterviewDialogbox />
      </div>
    </div>
  );
};

export default EmptyState;