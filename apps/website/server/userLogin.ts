import type server from "./types";

export const userLogin = async (body: server.UserLoginRequest) => {
  const { data, error } = await useFetch<server.UserLoginResponse>(
    `${useRuntimeConfig().public.serverPort}/auth/login`,
    {
      body,
      method: "post",
      headers: { "Content-Type": "application/json" },
    }
  );
  return { data, error };
};
