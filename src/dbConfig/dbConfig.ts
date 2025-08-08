import mongoose from "mongoose"; 

export async function connect(){
    try {
        mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection;

        connection.on("connected", ()=>{
            console.log('MongoDB connected Successfully');
        })

        connection.on("error", (error) => {
            console.log('MongoDB connection failed', error);
        })

    } catch (error) {
        console.log('Something went wrong!');
        console.log(error);
    }
}