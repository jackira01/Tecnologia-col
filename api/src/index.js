import express from "express"
import mongoose from "mongoose"
import morgan from "morgan"
import cors from "cors"

import { laptopProductRouter } from "./routes/laptopProductRouter.js"

const { PORT, ORIGIN_ALLOWED, MONGODB_URI } = process.env

/* const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true, }, ssl: true,
}; */

const server = express()
//Configure for specific origins
const whitelist = ORIGIN_ALLOWED
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin)) {
            console.log(origin);
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

server.use(cors(corsOptions))

//see request by console
server.use(morgan("dev"))

//parser data to json
server.use(express.json())

//routes
server.use("/laptop-product", laptopProductRouter)


//server initialization
server.listen(PORT, async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Conectado a MongoDB, escuchando en el puerto ${PORT}`);
    } catch (error) {
        console.error(error);
    }
})