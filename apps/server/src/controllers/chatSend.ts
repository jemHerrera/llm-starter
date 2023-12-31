import express from "express";
import { DI } from "..";
import { Chat, User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";
import { Loaded } from "@mikro-orm/core";
import { Message } from "../utils/types/Message";

export const ChatSendRequest = z
  .object({
    chatId: z.string().optional(),
    message: z.string(),
  })
  .strict();

export type ChatSendRequest = z.infer<typeof ChatSendRequest>;
export type ChatSendResponse = {
  message: string;
};

export const chatSend = async (
  req: AuthenticatedRequest<{}, {}, ChatSendRequest>,
  res: express.Response<ChatSendResponse>
) => {
  try {
    const { em } = DI;
    if (!req.user) return res.sendStatus(500);

    const invalidRequestBody = !ChatSendRequest.safeParse(req.body).success;
    if (invalidRequestBody) return res.sendStatus(406);

    const { id } = req.user;

    const user = await em.findOne(User, { id });
    if (!user) return res.sendStatus(500);

    const { chatId, message } = req.body;

    let chat: Loaded<Chat, never> | null;

    if (!chatId) {
      chat = em.create(Chat, {
        user,
        topic: "",
        messages: [],
      });
    } else {
      chat = await em.findOne(Chat, {
        id: chatId,
        user: user.id,
      });
    }

    if (!chat) return res.sendStatus(500);

    // Do AI Stuff
    let aiResponse = "Replace this placeholder with a response from the LLM.";

    const userMessage: Message = { from: "user", text: message };
    const aiMessage: Message = { from: "ai", text: aiResponse };

    chat.messages = [
      ...chat.messages,
      JSON.stringify(userMessage),
      JSON.stringify(aiMessage),
    ];

    await em.flush();

    const successResponse: ChatSendResponse = {
      message: aiResponse,
    };

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
