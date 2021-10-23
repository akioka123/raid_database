import Vue from "vue";
import VueRouter from "vue-router";
import RaidEquipManage from "../views/RaidEquipManage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "",
    component: RaidEquipManage,
  },
  {
    path: "/equip_manage",
    name: "RaidEquipManage",
    component: () => import("../views/RaidEquipManage.vue"),
  },
  {
    path: "/new_member",
    name: "RegisterView",
    component: () => import("../views/RegisterView.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
