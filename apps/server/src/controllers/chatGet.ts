import express from "express";
import { DI } from "..";
import { Chat } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";
import { Message } from "../types";

export const ChatGetOwnRequest = z
  .object({
    chatId: z.string(),
  })
  .required()
  .strict();

export type ChatGetOwnRequest = z.infer<typeof ChatGetOwnRequest>;
export type ChatGetOwnResponse = Omit<Chat, "messages"> & {
  messages: Message[];
};

export const chatGetOwn = async (
  req: AuthenticatedRequest<{}, {}, ChatGetOwnRequest>,
  res: express.Response<ChatGetOwnResponse>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);

    const chat = await em.findOne(Chat, {
      id: req.body.chatId,
      user: req.user.id,
    });

    if (!chat) return res.sendStatus(404);

    const successResponse = {
      ...chat,
      ...{ messages: chat.messages.map((m) => JSON.parse(m) as Message) },
    };

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
