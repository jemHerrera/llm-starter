import express from "express";
import user from "./user";
import chat from "./chat";

const router = express.Router();

export default (): express.Router => {
  user(router);
  chat(router);

  return router;
};
