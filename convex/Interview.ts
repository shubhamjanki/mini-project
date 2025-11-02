import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const SaveInterviewQuestion = mutation({
  args: {
    questions: v.any(),
    userId: v.id("UserTable"),
    resumeUrl: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("InterviewSessionTable", {
      userId: args.userId,
      resumeUrl: args.resumeUrl,
      jobTitle: args.jobTitle,
      jobDescription: args.jobDescription,
      interviewQuestions: args.questions,
      status: "pending",
    });
    return result;
  },
});

export const GetInterviewQuestions = query({
  args: {
    interviewId: v.id("InterviewSessionTable"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query("InterviewSessionTable")
      .filter(q => q.eq(q.field("_id"), args.interviewId))
      .collect();
    return result;
  },
});

export const SaveInterviewResponses = mutation({
  args: {
    interviewId: v.id("InterviewSessionTable"),
    transcript: v.array(v.object({
      role: v.string(),
      text: v.string(),
      timestamp: v.number(),
    })),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { interviewId, transcript, duration } = args;
    
    // Update the interview session with responses
    await ctx.db.patch(interviewId, {
      transcript: transcript,
      duration: duration,
      completedAt: Date.now(),
      status: "completed",
    });

    return { success: true, interviewId };
  },
});

// Get interview feedback
export const GetInterviewFeedback = query({
  args: { 
    interviewId: v.id("InterviewSessionTable") 
  },
  handler: async (ctx, args) => {
    const interview = await ctx.db.get(args.interviewId);
    return interview;
  },
});