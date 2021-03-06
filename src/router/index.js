import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import store from "@/store/index.js";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "LoginView",
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const session_user_name = sessionStorage.getItem("user_name");
      if (store.state.user_name) {
        next({ name: "RaidEquipManage" });
      } else if (session_user_name) {
        store.dispatch("set_user_name", session_user_name);
        next({ name: "RaidEquipManage" });
      } else {
        next();
      }
    },
  },
  {
    path: "/equip_manage",
    name: "RaidEquipManage",
    component: () => import("../views/RaidEquipManage.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.state.user_name) {
        next({ name: "LoginView" });
      } else {
        next();
      }
    },
  },
  {
    path: "/new_member",
    name: "RegisterView",
    component: () => import("../views/RegisterView.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.state.user_name) {
        next({ name: "LoginView" });
      } else {
        next();
      }
    },
  },
  {
    path: "/login",
    name: "LoginView",
    component: () => import("../views/LoginView.vue"),
    beforeEnter: (to, from, next) => {
      if (store.state.user_name) {
        next({ name: "RaidEquipManage" });
      } else {
        next({ name: "LoginView" });
      }
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
