<script setup lang="ts">
import { useState, useCookie } from "nuxt/app";
import { ref } from "vue";
import type server from "../server/types";

import { chatGet } from "../server/chatGet";
import { chatSend } from "../server/chatSend";

const user = useState<server.UserResponseData | null>("user");
const sessionToken = useCookie("llm-starter-session");

const userText = ref("");
const messages = ref<server.Message[]>([]);
const error = ref<boolean>(false);

const getChat = async (): Promise<void> => {
  const chatId = user.value?.chats[0];

  if (!chatId) return;

  if (!sessionToken.value) {
    error.value = true;
    return;
  }

  const { data, error: err } = await chatGet({ chatId }, sessionToken.value);

  if (err.value || !data.value) {
    console.error(err.value);
    error.value = true;
    return;
  }

  messages.value = data.value.messages;
};

getChat();

const sendMessage = async (): Promise<void> => {
  if (!sessionToken.value) {
    error.value = true;
    return;
  }

  const userMessage: server.Message = {
    from: "user",
    text: userText.value,
  };
  messages.value.push(userMessage);
  userText.value = "";

  const { data, error: err } = await chatSend(
    {
      chatId: user.value?.chats[0],
      message: userText.value,
    },
    sessionToken.value
  );

  if (err.value || !data.value) {
    error.value = true;
    console.error(err.value);
    return;
  }

  const aiMessage: server.Message = {
    from: "ai",
    text: data.value.message,
  };
  messages.value.push(aiMessage);
};
</script>

<template>
  <div class="llm-starter">
    <Sidebar />
    <div class="llm-starter-chat">
      <div class="chatbox" v-if="messages.length">
        <template v-for="(message, index) of messages" :key="index">
          <p :class="['message', `from-${message.from}`]">
            <span v-if="message.from == 'ai'">Sensei: </span>
            <span v-if="message.from == 'user'">You: </span>
            <span>{{ message.text }}</span>
          </p>
        </template>
      </div>
      <form class="llm-starter-text-bar" @submit.prevent="sendMessage">
        <div class="form-item">
          <input type="text" name="chat" id="chat" v-model="userText" />
          <button type="submit">Send</button>
        </div>
      </form>
      <p v-if="error" style="color: red">
        There's been an error. Please try again later.
      </p>
    </div>
  </div>
</template>
