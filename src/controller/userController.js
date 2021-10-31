import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserList = async (req, res, next) => {
    try {
        const limit = req.query.limit
            ? parseInt(req.query.limit, 10)
            : undefined;
        if (Number.isNaN(limit)) {
            return res.status(400).end();
        }

        const users = await prisma.user.findMany({
            take: limit,
        });

        return res.json(users);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).end();
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).send();
        return res.json(user);
    } catch (err) {
        console.error(err);
        next();
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).end();

        const user = await prisma.user.delete({ where: { id } });
        res.status(204).end();
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const name = req.body.name;

        if (!name) return res.status(400).end();

        const user = await prisma.user.create({ data: { name: name } });
        if (!user) return res.status(409).send({ message: "중복데이터" });

        return res.status(201).send(user);
    } catch (err) {
        console.error(err);
        if (err.meta.target === "User_name_key") {
            return res.status(409).send({ message: "중복데이터" });
        }
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).end();

        const name = req.body.name;
        if (!name) return res.status(400).end();

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return res.status(404).send({ message: "없는 유저" });

        const newUser = await prisma.user.update({
            where: { id },
            data: { name },
        });

        return res.status(200).json(newUser);
    } catch (err) {
        console.error(err);
        if (err.meta.target === "User_name_key") {
            return res.status(409).send({ message: "이미 사용중인 이름" });
        }
        next(err);
    }
};
