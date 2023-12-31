import type server from "./types";

export const userCreate = async (body: server.UserCreateRequest) => {
  const { data, error } = await useFetch<server.UserCreateResponse>(
    `${useRuntimeConfig().public.serverPort}/auth/register`,
    {
      body,
      method: "post",
      headers: { "Content-Type": "application/json" },
    }
  );
  return { data, error };
};
