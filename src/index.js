import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

let users = [
    { id: 1, name: "inhyeok" },
    { id: 2, name: "hyojin" },
    { id: 3, name: "kimmi" },
];

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.get("/users", (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }
    res.json(users.slice(0, limit));
});

app.get("/users/:id", (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();
    const user = users.filter((user) => user.id === id)[0];
    if (!user) return res.status(404).send();
    return res.json(user);
});

app.delete("/users/:id", (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();

    const user = users.filter((user) => user.id !== id);
    res.status(204).end();
});

app.post("/users", (req, res, next) => {
    const name = req.body.name;

    if (!name) return res.status(400).end();

    const isConflict = users.filter((user) => user.name === name).length;
    console.log(isConflict);
    if (isConflict) return res.status(409).end();

    const id = Date.now();
    const user = { id, name };
    const userlist = users.concat([user]);
    return res.status(201).send(user);
});

app.put("/users/:id", (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();

    const name = req.body.name;
    if (!name) return res.status(400).end();

    const isExistName = users.filter((user) => user.name === name)[0];
    if (isExistName) return res.status(409).end();

    const user = users.filter((user) => user.id === id)[0];
    if (!user) return res.status(404).end();

    user.name = name;

    return res.status(200).json(user);
});

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT + "서버 시작");
});

export default app;
