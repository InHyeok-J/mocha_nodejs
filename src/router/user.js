import express from "express";
import * as UserController from "../controller/userController";
const router = express.Router();

router.get("/", UserController.getUserList);

router.get("/:id", UserController.getUser);

router.delete("/:id", UserController.deleteUser);

router.post("/", UserController.createUser);

router.put("/:id", UserController.updateUser);

export default router;
