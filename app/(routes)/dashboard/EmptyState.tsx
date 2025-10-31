import React from 'react';
import {Button} from '@/components/ui/button'
import CreateInterviewDialogbox from '../_component/CreateInterviewDialogbox';
const EmptyState: React.FC = () => {
    return (
        <div className="w-full mt-14 mx-auto gap-5 bg-gray-50 rounded-2xl border-dashed p-10 border-4 h-full flex flex-col items-center justify-center">
            <img src={'/interview.png'} alt="emptyState"  className='max-w-[100px] h-auto'/ >
            <h1>there is no  interview created</h1>
            <CreateInterviewDialogbox/>
            
            </div>
            

    );
};

export default EmptyState;