import express, { Application, json } from "express";
import cors from 'cors';

import { connect } from "./utils/dbConnect";
import { signup, signin, protect } from "./utils/auth";
import { createMovie, getMovies, updateMovie, deleteMovie, getTopMovies, getCommingSoonMovies } from "./resources/movie/controller";
import  seatsRouter from "./resources/seat/routes";
import  bookingRouter  from "./resources/booking/routes";


const app: Application = express();
const port: number = 3002;

app.use(cors())
app.use(json());

app.post('/signup', signup)
app.post('/signin', signin)

// Movie routes (protected by admin)
app.post('/movies', protect, createMovie);
app.get('/movies', getMovies);
app.get('/movies/top', getTopMovies);
app.get('/movies/soon', getCommingSoonMovies);
app.put('/movies/:id', protect, updateMovie);
app.delete('/movies/:id', protect, deleteMovie);
app.use('/seats', seatsRouter);
app.use('/booking', bookingRouter)

export const serverStart = async () => {
    try {
        await connect();
        app.listen(port, () => {
            console.log(`Server listening to port ${port}`)
        })
    } catch (error) {
        console.log("error-> ", error);
    }
}