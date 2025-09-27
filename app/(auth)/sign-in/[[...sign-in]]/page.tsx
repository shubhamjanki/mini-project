import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex justify-center items-center h-screen'>
     <SignIn
  appearance={{
    elements: {
      headerTitle: "Sign in to AI Mock Interview  ",
      // or override `title`, `header`, or similar depending on version
    }
  }}
/>

    </div>
  )
}
