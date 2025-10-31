"use client"
import React from 'react'
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from 'react';

interface ResumeUploadProps {
  // Parent may pass a single File (you used setFiles={(file: File) => ...}).
  setFiles?: (file: File) => void;
}

function ResumeUpload({ setFiles }: ResumeUploadProps) {
  const [files, setFilesLocal] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    setFilesLocal(files);
    console.log(files);
    if (setFiles && files.length > 0) {
      // pass the first file to parent (matches earlier usage)
      setFiles(files[0]);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  )
}

export default ResumeUpload