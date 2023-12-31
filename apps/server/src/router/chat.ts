import express from "express";
import { chatSend } from "../controllers/chatSend";
import { chatGetOwn } from "../controllers/chatGet";
import { userAuthenticate } from "../middlewares/userAuthenticate";

export default (router: express.Router) => {
  router.post("/chat/send", userAuthenticate, chatSend);
  router.post("/chat", userAuthenticate, chatGetOwn);
};
