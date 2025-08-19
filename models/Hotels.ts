import mongoose, { Schema, model } from "mongoose";
import z from "zod";

// Zod Schemas
export const DishZodSchema = z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    imageUrl: z.string(),
    type: z.enum(["veg", "non-veg", "vegan"]).default("veg"),
    price: z.string().optional(),
});

export const HotelZodSchema = z.object({
    ownerId: z.string(),
    hotelWebsite: z.string().optional(),
    hotelId: z.string(),
    name: z.string(),
    typeOfCuisine: z.array(z.string()),
    dishes: z.array(DishZodSchema),
    location: z.string().optional()
});

export type TDish = z.infer<typeof DishZodSchema>;
export type THotel = z.infer<typeof HotelZodSchema>;

// Mongoose Schemas
const DishSchema = new Schema<TDish>({
    name: { type: String, required: true },
    ingredients: [String],
    imageUrl: { type: String },
    type: { type: String, enum: ["veg", "non-veg", "vegan"], default: "veg" },
    price: { type: String },
});

const HotelSchema = new Schema<THotel>({
    ownerId: { type: String, required: true },
    hotelWebsite: { type: String },
    hotelId: { type: String, required: true },
    name: { type: String, required: true },
    typeOfCuisine: [String],
    dishes: [DishSchema],
    location: { type: String }
});

const Hotel = mongoose.models.Hotel || model<THotel>("Hotel", HotelSchema);

export default Hotel;