import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import CanvasPage from "./pages/CanvasPage";
import HomePage from "./pages/MainPage.vue";

// @ts-ignore
const app = createApp(App);

const routes = [
  { path: "/", component: HomePage },
  { path: "/:id", component: CanvasPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);

app.mount("#app");
