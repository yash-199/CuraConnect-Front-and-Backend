import express from 'express'
import cors from 'cors'
// import 'dotenv/config'
import connectDB from './config/mongoDB.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import dotenv from 'dotenv';
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
dotenv.config();

// app Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middleware
app.use(express.json());
app.use(cors())

// api endpoint
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log('Server Start', port));