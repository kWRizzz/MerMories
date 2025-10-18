import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/post.js';
import userRoutes from './routes/users.js';

const app = express(); 
dotenv.config();


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/post',postRoutes)
app.use('/user',userRoutes)

//const CONNECTION_URL = 'mongodb+srv://saksham:12345@cluster0.zltdi71.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.CONNECTION_URL)

  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));