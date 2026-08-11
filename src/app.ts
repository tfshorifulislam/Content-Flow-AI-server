import express, { Application, Request, Response } from "express";
import cors from 'cors'
import { createUser } from "./CreateUser";

const app: Application = express();

app.use(cors())
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Content Flow Server is running!");
});

app.post("/users", createUser);

export default app;