import mongoose, { Schema } from "mongoose";
import z from "zod";


export const PreferenceZ = z.object({
    hotel: z.string().optional(),
    favoriteDishes: z.array(z.string()).default([]),
    foodType: z.enum(["veg", "non-veg", "vegan"]).optional(),
    dayOfWeek: z.string().optional(),
});

// Context schema
export const ContextZ = z.object({
    mood: z.string().optional(),
    weather: z.string().optional(),
    peopleCount: z.number().optional(),
    recommendedItems: z.array(z.string()).default([]),
    timestamp: z.date().optional(),
});

// User schema
export const UserZ = z.object({
    uuid: z.string().min(1),
    accessedHotels: z.array(z.string()).default([]),
    preferences: z.array(PreferenceZ).default([]),
    contextHistory: z.array(ContextZ).default([]),
    lastVisit: z.date().optional(),
});

// Types for TS usage
export type PreferenceInput = z.infer<typeof PreferenceZ>;
export type ContextInput = z.infer<typeof ContextZ>;
export type UserInput = z.infer<typeof UserZ>;

const PreferenceSchema = new Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    favoriteDishes: [String],
    foodType: { type: String, enum: ["veg", "non-veg", "vegan"] },
    dayOfWeek: { type: String },          // e.g., "Tuesday"
});

const ContextSchema = new Schema({
    mood: { type: String },               // e.g., "happy", "romantic"
    weather: { type: String },            // e.g., "sunny", "rainy"
    peopleCount: { type: Number },
    recommendedItems: [String],           // what AI suggested
    timestamp: { type: Date, default: Date.now },
});

const UserSchema = new Schema({
    uuid: { type: String, required: true, unique: true },  // anonymous ID
    accessedHotelsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }],
    preferences: [PreferenceSchema],
    contextHistory: [ContextSchema],
    lastVisit: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model<UserInput>("User", UserSchema);