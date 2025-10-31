import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const SaveInterviewQuestion = mutation({
  args: {
    questions: v.any(),
    userId: v.id("UserTable"),
    resumeUrl: v.optional(v.string()), // Changed from v.string() to v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewSessionTable", {
      userId: args.userId,
      resumeUrl: args.resumeUrl, // Now can be undefined
      interviewQuestions: args.questions,
      status: "pending", // or whatever default status you want
    });
    return result;
  },
});
