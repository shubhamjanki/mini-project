import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
function AppHeader(){
    const MenuOptions = [
      {
        name:'Dashboard',
        path:'/dashboard'
      },
      { 
        name:'Upgrade',
        path:'/upgrade'
      },
      {
        name:'How It Works',
        path:'/how-it-works'
      }
    ]
    return(
        <div>
             <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
         
                  <div className="flex items-center gap-2">
                   
                    <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                    {/* <h1 className="text-base font-bold md:text-2xl">AI Mock Interview</h1> */}
                  </div>
                     <ul className='flex gap-5'>
                    {MenuOptions.map((option) => (
                      <li className=" text-lg hover:scale-105 transition-all cursor-pointer duration-200 font-medium mx-4" key={option.name}>
                        {option.name}
                      </li>
                    ))}
                  </ul>  
                  <UserButton/>
                  
                </nav>
        </div>
    )
}
export default AppHeader;