<script setup lang="ts">
import { useCookie, useState, navigateTo } from "nuxt/app";
import type server from "../server/types";

const user = useState<server.UserResponseData | null>("user");

const logout = async (): Promise<void> => {
  const sessionCookie = useCookie("llm-starter-session");

  if (user.value) {
    user.value = null;
    sessionCookie.value = null;

    await navigateTo("/login");
  }
};
</script>

<template>
  <div v-if="user" class="side-bar">
    <p>Logged in as: {{ user.username }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>
