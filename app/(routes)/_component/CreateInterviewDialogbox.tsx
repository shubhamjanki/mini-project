import React, { useContext, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeUpload from './ResumeUpload'
import JobDescription from './JobDescription'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'
import { useMutation } from 'convex/react'
import { UserDetailContext } from '@/app/context/UserDetailContext'
import { api } from '@/convex/_generated/api'

function CreateInterviewDialogbox() {
    const [formData, setFormData] = useState<Record<string, any>>({}) // initialize as empty object
    const [files, setFiles] = useState<File[]>([]); 
    const [loading, setLoading] = useState<boolean>(false);
    const {userDetail, setUserDetail} = useContext(UserDetailContext);
    const saveInterviewQuestions = useMutation(api.Interview.SaveInterviewQuestion)
    
    function onHandleInputChange(field: string, data: any) {
        setFormData((prev: any) => ({
             ...(prev || {}),
            [field]: data
           })
        )
        console.log(formData);
    }

    async function onSubmit() {
      // allow submit when either a file is present OR jobTitle/jobDescription provided
      if (!files.length && !formData?.jobTitle && !formData?.jobDescription) return;
      
      console.log("User detail:", userDetail);
      console.log("User ID:", userDetail?._id);
      console.log("Form data before submit:", formData); // Add this log
      
      if (!userDetail?._id) {
        alert("You must be signed in to save interview questions");
        return;
      }
      
      setLoading(true);
      
      const uploadFormData = new FormData();
      if (files.length) uploadFormData.append('file', files[0]);
      uploadFormData.append('jobTitle', formData?.jobTitle || '');
      uploadFormData.append('jobDescription', formData?.jobDescription || '');
      
      try {
        const res = await axios.post(
          '/api/generate-interview-question',
          uploadFormData
        );
        console.log("API response:", res.data); // Add this log
        
        const resp = await saveInterviewQuestions({
          questions: res.data?.questions,
          userId: userDetail._id,
          resumeUrl: res.data?.uploadInfo?.url,
          jobTitle: formData?.jobTitle, // Use formData directly instead of res.data
          jobDescription: formData?.jobDescription, // Use formData directly instead of res.data
        });
        console.log("Convex save response:", resp); // Add this log
      } catch (err) {
         console.log("Error uploading file", err);
      } finally {
        setLoading(false);
      }
    }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create Interview</Button>
      </DialogTrigger>
      <DialogContent className='w-full min-w-3xl'>
        <DialogHeader>
          <DialogTitle>Pls fill the requirements!!</DialogTitle>
          <DialogDescription>
            <Tabs defaultValue="resume" className="w-full mt-5">
              <TabsList>
                <TabsTrigger value="resume">ResumeUpload</TabsTrigger>
                <TabsTrigger value="JobDescription">JobDescription</TabsTrigger>
              </TabsList>
              <TabsContent value="resume">
                <ResumeUpload setFiles={(file: File) => setFiles([file])} />
              </TabsContent>
              <TabsContent value="JobDescription">
                <JobDescription onHandleInputChange={onHandleInputChange} />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex gap-6'>
          <DialogClose asChild>
            <Button variant={'ghost'}>Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={loading || !(files.length > 0 || formData?.jobTitle || formData?.jobDescription) || !userDetail?._id}> {/* Changed from .id to ._id */}
            {loading ? <Loader2Icon className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> : null}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateInterviewDialogbox