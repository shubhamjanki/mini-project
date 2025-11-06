'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import EmptyState from './EmptyState'; // adjust path if needed
import CreateInterviewDialogbox from '../_component/CreateInterviewDialogbox';
import Aurora from "./_component/Aurora"

function Dashboard() {

  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
   return (
    <div className="relative">
      {/* Aurora background effect (fixed, behind content) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10">
        <Aurora colorStops={["#1e3a8a", "#3b82f6", "#1e3a8a"]} amplitude={1.2} blend={0.6} speed={0.8} />
      </div>

      <div className="mt-[30px] py-20 px-50 md:px-20 lg:px-44 xl:px-56 2xl:px-80 flex flex-col gap-6">
        {/* Header Row */}
        <div className='flex items-center justify-between '>
          <div>
            <h1 className='text-lg text-gray-500'>My Dashboard</h1>
            <h1 className='text-2xl font-bold'>
              Welcome, {user?.fullName || 'Guest'}
            </h1>
          </div>
          <CreateInterviewDialogbox/>
        </div>

        {/* Empty State */}
        {interviewList.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}

export default Dashboard;
