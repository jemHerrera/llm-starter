import express from "express";
import { DI } from "..";
import { User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { UserResponseData } from "../utils/types/UserResponseData";

export const userGetOwn = async (
  req: AuthenticatedRequest,
  res: express.Response<UserResponseData>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);

    const { id } = req.user;

    const user = await em.findOne(User, { id }, { populate: ["chats.id"] });
    if (!user) return res.sendStatus(500);

    const successResponse: UserResponseData = {
      id: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified || false,
      isAdmin: user.isAdmin || false,
      product: user.product.name,
      chats: user.chats.getItems().map((c) => c.id),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export type UserGetRequest = { id: string };
export type UserGetResponse = UserResponseData;

export const userGet = async (
  req: AuthenticatedRequest<{}, {}, UserGetRequest>,
  res: express.Response<UserResponseData>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);
    if (!req.user.isAdmin) return res.sendStatus(403);

    const { id } = req.body;

    const user = await em.findOne(User, { id }, { populate: ["chats.id"] });
    if (!user) return res.sendStatus(404);

    const successResponse: UserResponseData = {
      id: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified || false,
      isAdmin: user.isAdmin || false,
      product: user.product.name,
      chats: user.chats.getItems().map((c) => c.id),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
