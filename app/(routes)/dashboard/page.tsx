'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import EmptyState from './EmptyState'; // adjust path if needed

function Dashboard() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  return (
    <div className='py-20 px-10 md:px-20 lg:px-44 xl:px-56 2xl:px-80 flex flex-col gap-6'>
      {/* Header Row */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-lg text-gray-500'>My Dashboard</h1>
          <h1 className='text-2xl font-bold'>
            Welcome, {user?.fullName || 'Guest'}
          </h1>
        </div>
        <Button size='lg'>+ Create Interview!!</Button>
      </div>

      {/* Empty State */}
      {interviewList.length === 0 && <EmptyState />}
    </div>
  );
}

export default Dashboard;
