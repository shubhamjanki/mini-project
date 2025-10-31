"use client"
import React, { useState } from "react";

interface JobDescriptionProps {
  onHandleInputChange: (field: string, data: any) => void;
}

export default function JobDescription({ onHandleInputChange }: JobDescriptionProps) {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

  const handleTitleChange = (v: string) => {
    setJobTitle(v);
    onHandleInputChange("jobTitle", v);
  };

  const handleDescriptionChange = (v: string) => {
    setJobDescription(v);
    onHandleInputChange("jobDescription", v);
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
          className="w-full rounded border px-3 py-2 bg-white dark:bg-black border-neutral-200 dark:border-neutral-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Paste the job description or write a short summary..."
          rows={8}
          className="w-full rounded border px-3 py-2 resize-y bg-white dark:bg-black border-neutral-200 dark:border-neutral-800"
        />
        <div className="text-xs text-neutral-500 mt-1">
          {jobDescription.length} characters
        </div>
      </div>
    </div>
  );
}