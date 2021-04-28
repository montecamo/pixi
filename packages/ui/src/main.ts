import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

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
  history: createWebHashHistory(),
  routes,
});

app.use(router);

app.mount("#app");
