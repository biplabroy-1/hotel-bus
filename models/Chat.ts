import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export const MessageZ = z.object({
    role: z.enum(["user", "ai"]),
    message: z.string(),
    timestamp: z.date().optional(),
});

export const ChatZ = z.object({
    userId: z.string().optional(),   // ObjectId as string
    hotelId: z.string().optional(),  // ObjectId as string
    messages: z.array(MessageZ),
    createdAt: z.date().optional(),
});

// Input types
export type MessageInput = z.infer<typeof MessageZ>;
export type ChatInput = z.infer<typeof ChatZ>;


const MessageSchema = new Schema<MessageInput>({
    role: { type: String, enum: ["user", "ai"], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new Schema<ChatInput>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    messages: [MessageSchema],
    createdAt: { type: Date, default: Date.now },
});


export const Chat = mongoose.models.User || mongoose.model<ChatInput>("Chat", ChatSchema);