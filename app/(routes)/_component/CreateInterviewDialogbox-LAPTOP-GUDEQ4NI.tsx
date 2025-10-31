import React, { useState } from 'react'
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

function CreateInterviewDialogbox() {
    const [formData, setFormData] = useState<any>()
    const [files, setFiles] = useState<File[]>([]); 
    const [loading, setLoading] = useState<boolean>(false);
    
    function onHandleInputChange(field: string, data: any) {
        setFormData((prev: any) => ({
             ...prev,
            [field]: data
           })
        )
        console.log(formData);
    }

    async function onSubmit() {
      if (!files.length) return;
      setLoading(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', files[0]);
      
      try {
        // FIXED: Pass formData and set correct headers
        const res = await axios.post(
          '/api/generate-interview-question',
          uploadFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log("File uploaded successfully", res.data);
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
          <DialogClose>
            <Button variant={'ghost'}>Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={loading || !files.length}>
            {loading ? <Loader2Icon className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> : null}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateInterviewDialogbox