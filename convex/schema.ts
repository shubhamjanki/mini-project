import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string()   
  }),
  InterviewSessionTable: defineTable({
    userId: v.id("UserTable"),
    resumeUrl: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    interviewQuestions: v.any(),
    status: v.string() ,
    transcript: v.optional(v.array(v.object({
      role: v.string(),
      text: v.string(),
      timestamp: v.number(),
    }))),
    duration: v.optional(v.number()),
    completedAt: v.optional(v.number()),

  }),
})