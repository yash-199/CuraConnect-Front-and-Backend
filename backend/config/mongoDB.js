import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://byash0720:YashBhardwaj123@cluster0.nxyne.mongodb.net/doctors-appoint')
        .then(() => console.log("DB Connect"));
}

export default connectDB;