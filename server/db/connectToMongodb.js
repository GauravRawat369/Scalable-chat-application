import mongoose from "mongoose";

const connectToMongodb = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("connected to Mongo db");
    } catch (error) {
        console.log("Error", error)
    }
}
export default connectToMongodb; 
