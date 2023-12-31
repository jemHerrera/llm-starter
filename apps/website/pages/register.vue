<script setup lang="ts">
import { userCreate } from "../server/userCreate";
import { reactive, ref } from "vue";

const data = reactive({
  email: "",
  username: "",
  password: "",
  confirm: "",
});

const errors = ref<string[]>([]);
const successfulyRegistered = ref<boolean>(false);

const register = async (): Promise<void> => {
  const passwordsMatch = data.password === data.confirm;

  if (!passwordsMatch) {
    errors.value.push("Passwords don't match");
    return;
  }

  const { error } = await userCreate({
    email: data.email,
    username: data.username,
    password: data.password,
  });

  if (error.value) return console.error(error.value);

  successfulyRegistered.value = true;
};
</script>

<template>
  <div class="page-register">
    <template v-if="!successfulyRegistered">
      <h1>Register</h1>
      <p style="color: red" v-if="errors.length">
        <span v-for="(e, idx) in errors" :key="idx">{{ e }}</span>
      </p>
      <form @submit.prevent="register" autocomplete="off">
        <div class="form-item">
          <label for="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            v-model="data.username"
            required
          />
        </div>
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
        <div class="form-item">
          <label for="password">Confirm Passsword: </label>
          <input
            type="password"
            name="confirm"
            id="confirm"
            required
            v-model="data.confirm"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </template>
    <div v-else>
      <p>Successfuly registered.</p>
      <RouterLink to="/login">Login</RouterLink>
    </div>
  </div>
</template>
