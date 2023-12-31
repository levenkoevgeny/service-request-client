import { createRouter, createWebHistory } from "vue-router"

import {
  NotFoundView,
  NetworkErrorView,
  ServerErrorView,
} from "@/components/errors"
import { ClientMainView, ServiceRequestChatView } from "@/components/client"
import {
  AdminMainView,
  AdminUsersView,
  AdminServiceRequestsView,
  AdminServiceRequestItemView,
} from "@/components/admin"
import { LoginView, RegistrationView } from "@/components/auth"

import store from "@/store"

const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  { path: "", name: "root", redirect: "/client" },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/registration",
    name: "registration",
    component: RegistrationView,
    meta: { requiresAuth: false },
  },
  {
    path: "/client",
    name: "client-main",
    component: ClientMainView,
    meta: { requiresAuth: true },
  },
  {
    path: "/client/:requestId",
    name: "service-request-view",
    component: ServiceRequestChatView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminMainView,
    meta: { requiresAuth: true, requiresStaff: true },
    redirect: "/admin/users",
    children: [
      {
        path: "service-requests",
        name: "admin-requests",
        component: AdminServiceRequestsView,
      },
      {
        path: "service-requests/:requestId",
        name: "admin-requests-item",
        component: AdminServiceRequestItemView,
      },

      {
        path: "users",
        name: "admin-users",
        component: AdminUsersView,
      },
    ],
  },
  {
    path: "/network-error",
    name: "network-error",
    component: NetworkErrorView,
    meta: { requiresAuth: false },
  },
  {
    path: "/server-error",
    name: "server-error",
    component: ServerErrorView,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
})

router.beforeEach(async (to, from) => {
  await store.dispatch("auth/actionCheckLoggedIn")
  const isLoggedIn = store.getters["auth/getIsLoggedIn"]

  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    }
  }

  const user = store.getters["auth/getUser"]
  if (user) {
    const isStaff = user.is_staff
    if (to.meta.requiresStaff && !isStaff) {
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      }
    }
  }
})

export default router
