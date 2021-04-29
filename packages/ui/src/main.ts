import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import Canvas from "./Canva.vue";
import HomePage from "./components/MainPage.vue";

// @ts-ignore
const app = createApp(App);

const routes = [
  { path: "/", component: HomePage },
  { path: "/:id", component: Canvas },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);

app.mount("#app");
