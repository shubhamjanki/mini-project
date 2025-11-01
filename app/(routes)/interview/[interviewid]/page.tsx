import React from 'react'
import AppHeader from '../../_component/AppHeader'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Send } from 'lucide-react'

function Interview() {
  return (
    <>
      <div>
        <AppHeader/>
        <div className="flex justify-center pt-10 rounded-lg">
          <Image src={"/interviewpage.png"} alt="Interview Image" width={500} height={300} className=' h-[250px] w-[600px] rounded-lg object-cover' />
        </div>
        <div className='flex flex-col justify-center items-center pt-2 space-y-2 mb-10'>
          <h1 className='font-bold text-3xl text-center'>Ready to Start </h1>
          <p>The interview will begin shortly.</p>
          <Button>Start Interview<ArrowRight/></Button>
          <hr />
         <div className='flex bg-gray-100  p-4 rounded-lg flex-col space-y-4 items-center mt-4'>         
          <h2 className='font-semibold text-2xl'>Want to send interview link to someone?</h2>
          
        <div className='flex   rounded-lg space-x-4 w-full max-w-md'>
          <Input type="text" className='flex-1 bg-white ' placeholder='Enter email or phone number' />
          <Button className='w-1/8   self-center '><Send/></Button>
        </div>
        </div>
 
        </div>
      </div>
    
    </>
  )
}

export default Interview