import { createRouter, createWebHistory } from "vue-router"

import NotFoundView from "@/components/common/NotFoundView"
import ClientMainView from "@/components/client/ClientMainView.vue"
import AdminMainView from "@/components/admin/AdminMainView.vue"
import LoginView from "@/components/auth/LoginView.vue"
import RegistrationView from "@/components/auth/RegistrationView.vue"

import store from "@/store"

const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
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
    path: "/admin",
    name: "admin",
    component: AdminMainView,
    meta: { requiresAuth: true, requiresStaff: true },
    // children: [
    //   {
    //     path: "",
    //     name: "admin-main",
    //     component: Main,
    //   },
    //   {
    //     path: "users",
    //     name: "admin-users",
    //     component: UsersList,
    //   },
    //   {
    //     path: "docs",
    //     name: "admin-docs",
    //     component: DocsList,
    //   },
    //   {
    //     path: "subdivisions",
    //     name: "admin-subdivisions",
    //     component: SubdivisionsList,
    //   },
    //   {
    //     path: "categories",
    //     name: "admin-categories",
    //     component: CategoriesList,
    //   },
    // ],
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
