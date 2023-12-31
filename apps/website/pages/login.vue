<script setup lang="ts">
import { reactive, ref } from "vue";
import { useCookie, navigateTo } from "nuxt/app";
import { userLogin } from "../server/userLogin";
import type server from "../server/types";

const data = reactive({
  email: "",
  password: "",
});

const error = ref<boolean>(false);

const login = async (): Promise<void> => {
  const { data: response, error: err } = await userLogin({
    email: data.email,
    password: data.password,
  });

  if (err.value) {
    error.value = true;
    return;
  }

  const { sessionToken } = response.value as server.UserLoginResponse;

  const sessionCookie = useCookie("llm-starter-session", {
    maxAge: 60 * 60 * 60 * 24 * 2, // 2 days, in seconds
  });

  sessionCookie.value = sessionToken;

  await navigateTo("/");
};
</script>

<template>
  <div class="page-login">
    <h1>Login</h1>
    <p v-if="error" style="color: red">Invalid email/password.</p>
    <form @submit.prevent="login">
      <div class="form-item">
        <label for="email">Email: </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          v-model="data.email"
        />
      </div>
      <div class="form-item">
        <label for="password">Passsword: </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          v-model="data.password"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
    <p>Don't have account yet? <NuxtLink to="/register">Register</NuxtLink></p>
  </div>
</template>
