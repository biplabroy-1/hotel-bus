import mongoose from "mongoose";

await mongoose.connect(process.env.DATABASE_URL || "").catch((error) => {
    console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db("myDB");

export { client };

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL || "");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}