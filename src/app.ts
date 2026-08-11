import express, { Application, Request, Response } from "express";
import cors from 'cors'
import { createUser } from "./CreateUser";
import { loginUser } from "./UserLogin";

const app: Application = express();

app.use(cors())
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Content Flow Server is running!");
});

//create new users;
app.post("/users", createUser);

//login user route;
app.post('/users/login', loginUser);

export default app;