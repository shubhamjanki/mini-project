"use client";

import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeUpload from "./ResumeUpload";
import JobDescription from "./JobDescription";
import axios from "axios";
import { Loader2Icon, Sparkles } from "lucide-react";
import { useMutation } from "convex/react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CreateInterviewDialogbox() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { userDetail } = useContext(UserDetailContext);
  const saveInterviewQuestions = useMutation(api.Interview.SaveInterviewQuestion);
  const router = useRouter();

  function onHandleInputChange(field: string, data: any) {
    setFormData((prev) => ({
      ...(prev || {}),
      [field]: data,
    }));
  }

  async function onSubmit() {
    if (!files.length && !formData?.jobTitle && !formData?.jobDescription) return;

    if (!userDetail?._id) {
      alert("You must be signed in to save interview questions");
      return;
    }

    setLoading(true);
    const uploadFormData = new FormData();
    if (files.length) uploadFormData.append("file", files[0]);
    uploadFormData.append("jobTitle", formData?.jobTitle || "");
    uploadFormData.append("jobDescription", formData?.jobDescription || "");

    try {
      const res = await axios.post("/api/generate-interview-question", uploadFormData);

      if (res?.data?.status == 429) {
        toast(res?.data?.message || "Rate limit exceeded. Please try again later.");
        return;
      }

      const interviewId = await saveInterviewQuestions({
        questions: res.data?.questions,
        userId: userDetail._id,
        resumeUrl: res.data?.uploadInfo?.url,
        jobTitle: formData?.jobTitle,
        jobDescription: formData?.jobDescription,
      });
      router.push("/interview/" + interviewId);
    } catch (err) {
      console.error("Error uploading file", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300 flex items-center gap-2">
          <Sparkles size={18} />
          Create Interview
        </Button>
      </DialogTrigger>

      <DialogContent className=" w-full min-w-3xl  bg-white/10 border border-white/20 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] text-white p-8">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Fill the Requirements
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Upload your resume or describe the job role to generate AI interview questions.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-full p-1 flex gap-2 justify-center">
            <TabsTrigger
              value="resume"
              className="rounded-full px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              Resume Upload
            </TabsTrigger>
            <TabsTrigger
              value="JobDescription"
              className="rounded-full px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              Job Description
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-2">
            <ResumeUpload setFiles={(file: File) => setFiles([file])} />
          </TabsContent>
          <TabsContent value="JobDescription" className="mt-6">
            <JobDescription onHandleInputChange={onHandleInputChange} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-end gap-4 mt-4">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onSubmit}
            disabled={
              loading ||
              !(files.length > 0 || formData?.jobTitle || formData?.jobDescription) ||
              !userDetail?._id
            }
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] rounded-full px-6 text-white font-semibold transition-all duration-300"
          >
            {loading && (
              <Loader2Icon className="mr-2 animate-spin" size={18} />
            )}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateInterviewDialogbox;
