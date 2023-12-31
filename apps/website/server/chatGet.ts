import type server from "./types";

export const chatGet = async (body: server.ChatGetOwnRequest, auth: string) => {
  const { data, error } = await useFetch<server.ChatGetOwnResponse>(
    `${useRuntimeConfig().public.serverPort}/chat`,
    {
      body,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${auth}`,
      },
    }
  );
  return { data, error };
};
