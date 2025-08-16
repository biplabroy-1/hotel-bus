import mongoose, { Schema, model } from "mongoose";
import z from "zod";

// Zod Schemas
export const DishZodSchema = z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    type: z.enum(["veg", "non-veg", "vegan"]).default("veg"),
    price: z.number().optional(),
});

export const HotelZodSchema = z.object({
    hotelId: z.string(),
    name: z.string(),
    typeOfCuisine: z.array(z.string()),
    dishes: z.array(DishZodSchema),
    location: z.string().optional(),
    qrCodeId: z.string().optional(),
});

export type Dish = z.infer<typeof DishZodSchema>;
export type Hotel = z.infer<typeof HotelZodSchema>;

// Mongoose Schemas
const DishSchema = new Schema<Dish>({
    name: { type: String, required: true },
    ingredients: [String],
    type: { type: String, enum: ["veg", "non-veg", "vegan"], default: "veg" },
    price: { type: Number },
});

const HotelSchema = new Schema<Hotel>({
    hotelId: { type: String },
    name: { type: String, required: true },
    typeOfCuisine: [String],       // e.g., ["Italian", "Indian"]
    dishes: [DishSchema],
    location: { type: String }
});

const Hotel = mongoose.models.User || model<Hotel>("Hotel", HotelSchema);

export default Hotel;