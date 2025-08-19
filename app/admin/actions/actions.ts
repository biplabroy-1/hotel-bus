"use server";

import connectDB from "@/lib/db";
import Hotel, { THotel } from "@/models/Hotels";
import { id } from "zod/v4/locales";

export async function createHotel(data: THotel) {
    await connectDB();
    const hotel = await Hotel.create({
        ownerId: data.ownerId,
        hotelWebsite: data.hotelWebsite,
        hotelId: data.hotelId,
        name: data.name,
        typeOfCuisine: data.typeOfCuisine,
        dishes: data.dishes,
        location: data.location
    });
    return hotel;
}

export async function getHotels() {
    await connectDB();
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    if (!hotels) {
        throw new Error("Hotels not found");
    }
    return hotels;
}

export async function getHotelsByOwner(ownerId: string) {
    await connectDB();
    const hotel = await Hotel.find({ ownerId }).sort({ createdAt: -1 });
    if (!hotel) {
        throw new Error("Hotels not found");
    }
    return hotel;
}

export async function updateHotel(id: string, data: any) {
    await connectDB();
    const hotel = await Hotel.findByIdAndUpdate(id, data, { new: true });
    if (!hotel) {
        throw new Error("Hotel not found");
    }
    return hotel;
}

export async function deleteHotel(id: string) {
    await connectDB();
    await Hotel.findByIdAndDelete(id);
    return { success: true };
}

export async function getDishes(userId: string) {
    await connectDB();
    const hotel = await Hotel.findById(userId);
    if (!hotel) {
        throw new Error("Dish not found");
    }
    const dishes = hotel?.dishes || [];
    return dishes;
}

export async function createDish(userId: string, data: any) {
    await connectDB();
    const hotel = await Hotel.findById(userId);
    if (!hotel) {
        throw new Error("Hotel not found");
    }
    const dishes = hotel?.dishes || [];
    dishes.push(data);
    await hotel.save();
    return dishes;
}

export async function updateDish(userId: string, dishId: string, data: any) {
    await connectDB();

    const hotel = await Hotel.findById(userId);
    if (!hotel) {
        throw new Error("Hotel not found");
    }

    const dish = hotel.dishes.id(dishId);
    if (!dish) {
        throw new Error("Dish not found");
    }

    Object.assign(dish, data);

    await hotel.save();
    return { success: true, dish };
}

export async function deleteDish(userId: string, id: string) {
    await connectDB();
    const hotel = await Hotel.findById(userId);
    if (!hotel) {
        throw new Error("Hotel not found");
    }
    const dishes = hotel?.dishes || [];
    dishes.filter((dish: any) => dish._id !== id);
    await hotel.save();
    return { success: true };
}