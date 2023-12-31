import express from "express";
import { DI } from "..";
import { User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";

export const UserDeleteRequest = z.object({ id: z.string() }).strict();

export type UserDeleteRequest = z.infer<typeof UserDeleteRequest>;
export type UserDeleteResponse = { deleted: true };

export const userDelete = async (
  req: AuthenticatedRequest<{}, {}, UserDeleteRequest>,
  res: express.Response<UserDeleteResponse>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);
    if (!req.user.isAdmin) return res.sendStatus(403);

    const invalidRequestBody = !UserDeleteRequest.safeParse(req.body).success;
    if (invalidRequestBody) return res.sendStatus(406);

    const { id } = req.body;

    const user = await em.findOne(User, { id });
    if (!user) return res.sendStatus(404);

    await em.remove(user).flush();

    return res.status(200).json({ deleted: true }).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
