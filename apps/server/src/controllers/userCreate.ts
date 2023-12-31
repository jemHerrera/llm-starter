import express from "express";
import { User } from "../db/entities";
import { DI } from "../index";
import z from "zod";
import argon2 from "argon2";

import { Product } from "../db/entities/Product";
import { UserResponseData } from "../types";

export const UserCreateRequest = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(6),
  })
  .strict();

export type UserCreateRequest = z.infer<typeof UserCreateRequest>;

export const userCreate = async (
  req: express.Request<{}, {}, UserCreateRequest>,
  res: express.Response<UserResponseData>
) => {
  try {
    const { em } = DI;

    const invalidRequestBody = !UserCreateRequest.safeParse(req.body).success;
    if (invalidRequestBody) return res.sendStatus(406);

    const { email, password, username } = req.body;

    const existingUser = !!(await em.findOne(User, {
      $or: [{ email }, { username }],
    }));
    if (existingUser) return res.sendStatus(409);

    const hashedPassword = await argon2.hash(password);

    const defaultProduct = await em.findOne(Product, { name: "Trial" });
    if (!defaultProduct) return res.sendStatus(500);

    const user = em.create(User, {
      email,
      password: hashedPassword,
      username,
      product: defaultProduct,
    });

    await em.flush();

    const successResponse: UserResponseData = {
      id: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified || false,
      isAdmin: user.isAdmin || false,
      product: user.product.name,
      chats: [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
