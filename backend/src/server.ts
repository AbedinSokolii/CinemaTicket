
import express, { Application, json } from "express";
import cors from 'cors';

import { connect } from "./utils/dbConnect";
import { signup, signin } from "./utils/auth";

const app: Application = express();
const port: number = 3000;

app.use(cors())
app.use(json());

app.post('/signup', signup)
app.post('/signin', signin)

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