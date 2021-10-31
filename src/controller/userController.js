let users = [
    { id: 1, name: "inhyeok" },
    { id: 2, name: "hyojin" },
    { id: 3, name: "kimmi" },
];

export const getUserList = (req, res, next) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }
    res.json(users.slice(0, limit));
};

export const getUser = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();
    const user = users.filter((user) => user.id === id)[0];
    if (!user) return res.status(404).send();
    return res.json(user);
};

export const deleteUser = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();

    const user = users.filter((user) => user.id !== id);
    res.status(204).end();
};

export const createUser = (req, res, next) => {
    const name = req.body.name;

    if (!name) return res.status(400).end();

    const isConflict = users.filter((user) => user.name === name).length;
    console.log(isConflict);
    if (isConflict) return res.status(409).end();

    const id = Date.now();
    const user = { id, name };
    const userlist = users.concat([user]);
    return res.status(201).send(user);
};

export const updateUser = (req, res, next) => {
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
};
