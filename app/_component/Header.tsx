import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'

function Header() {
  return (
    <div>
         <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        <h1 className="text-base font-bold md:text-2xl">AI Mock Interview</h1>
      </div>
      <Button>
        Get Started
      </Button>
          </nav>
    </div>
  )
}

export default Header
