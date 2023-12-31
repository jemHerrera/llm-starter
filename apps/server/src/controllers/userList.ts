import express from "express";
import { User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { DI } from "..";
import { UserResponseData } from "../types";

export type UserListRequest = { limit?: number; offset?: number };
export type UserListResponse = {
  users: UserResponseData[];
  total: number;
};

export const userList = async (
  req: AuthenticatedRequest<{}, {}, UserListRequest>,
  res: express.Response<UserListResponse>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);
    if (!req.user.isAdmin) return res.sendStatus(403);

    const { limit = 100, offset = 0 } = req.body;

    const [users, total] = await em.findAndCount(User, {}, { limit, offset });
    if (!users) return res.sendStatus(500);

    return res
      .status(200)
      .json({
        users: users.map((user) => {
          return {
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
        }),
        total,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
