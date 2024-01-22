import express from 'express'
import dotenv from "dotenv"
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors'
import path from 'path'
import compression from 'compression';

//configure env
dotenv.config();

//database congig
connectDB();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();


app.use(
    compression({
        level:6,
        threshold:10 * 1000,
        filter: (req, res) => {
            if(req.headers['x-no-compression']){
                return false
            }
            return compression.filter(req, res)
        },
    })
)
//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)
app.use(express.static(path.join(__dirname, './client/build')))


app.use("*", function(req, res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})


//port
const PORT = process.env.PORT || 8080;

// RUN Listen
app.listen(PORT, ()=> {
    console.log(`server running on port ${PORT}`)
})
