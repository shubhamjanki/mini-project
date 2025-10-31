import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const SaveInterviewQuestion = mutation({
  args: {
    questions: v.any(),
    userId: v.id("UserTable"),
    resumeUrl: v.optional(v.string()),
    jobTitle: v.optional(v.string()), // Add this
    jobDescription: v.optional(v.string()), // Add this
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewSessionTable", {
      userId: args.userId,
      resumeUrl: args.resumeUrl,
      jobTitle: args.jobTitle, // Add this
      jobDescription: args.jobDescription, // Add this
      interviewQuestions: args.questions,
      status: "pending",
    });
    return result;
  },
});
