"use server";

import connectDB from "@/lib/db";
import Hotel, { THotel } from "@/models/Hotels";
import { auth } from "@clerk/nextjs/server";

export async function createHotel(data: THotel) {
    try {
        const user = await auth();
        await connectDB();
        const hotel = await Hotel.create({
            ownerId: user.userId,
            hotelWebsite: data.hotelWebsite,
            hotelId: data.hotelId,
            name: data.name,
            typeOfCuisine: data.typeOfCuisine,
            dishes: data.dishes,
            location: data.location
        });
        return hotel;
    } catch (error) {
        throw new Error("Hotel not found");
    }
}

export async function getHotels() {
    try {
        const user = await auth();
        await connectDB();
        const hotels = await Hotel.find({ ownerId: user.userId }).sort({ createdAt: -1 });
        if (!hotels) {
            throw new Error("Hotels not found");
        }
        return hotels;
    } catch (error) {
        throw new Error("Hotels not found");
    }
}

export async function getHotelsByOwner(ownerId: string) {
    try {
        const user = await auth();
        await connectDB();
        const hotel = await Hotel.find({ ownerId: user.userId }).sort({ createdAt: -1 });
        if (!hotel) {
            throw new Error("Hotels not found");
        }
        return hotel;
    } catch (error) {
        throw new Error("Hotels not found");
    }
}

export async function updateHotel(id: string, data: any) {
    try {
        const user = await auth();
        await connectDB();
        const hotel = await Hotel.findByIdAndUpdate(id, data, { new: true });
        if (!hotel) {
            throw new Error("Hotel not found");
        }
        return hotel;
    } catch (error) {
        throw new Error("Hotel not found");
    }
}

export async function deleteHotel(id: string) {
    try {
        await connectDB();
        await Hotel.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        throw new Error("Hotel not found");
    }
}

export async function getDishes() {
    try {
        const user = await auth();
        await connectDB();
        const hotel = await Hotel.findById(user.userId);
        if (!hotel) {
            throw new Error("Dish not found");
        }
        const dishes = hotel?.dishes || [];
        return dishes;
    } catch (error) {
        throw new Error("Dish not found");
    }
}

export async function createDish(data: any) {
    try {
        const user = await auth();
        await connectDB();
        const hotel = await Hotel.findById(user.userId);
        if (!hotel) {
            throw new Error("Hotel not found");
        }
        const dishes = hotel?.dishes || [];
        dishes.push(data);
        await hotel.save();
        return dishes;
    } catch (error) {
        throw new Error("Dish not found");
    }
}

export async function updateDish(dishId: string, data: any) {
    try {
        const user = await auth();
        await connectDB();

        const hotel = await Hotel.findById(user.userId);
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
    } catch (error) {
        throw new Error("Dish not found");
    }
}

export async function deleteDish(id: string) {
    try {
        const user = await auth();
        await connectDB();
        const hotel = await Hotel.findById(user.userId);
        if (!hotel) {
            throw new Error("Hotel not found");
        }
        const dishes = hotel?.dishes || [];
        dishes.filter((dish: any) => dish._id !== id);
        await hotel.save();
        return { success: true };
    } catch (error) {
        throw new Error("Dish not found");
    }
}