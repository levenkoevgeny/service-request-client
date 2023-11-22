<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <AvatarView :user-data="userData" />

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item fs-5">
              <a class="nav-link" href="/admin/service-requests">Заявки</a>
            </li>
            <li class="nav-item fs-5">
              <a class="nav-link" href="/admin/users">Пользователи</a>
            </li>
            <li class="nav-item fs-5">
              <a class="nav-link" @click="logOut" style="cursor: pointer"
                >Выход из системы</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import AvatarView from "@/components/common/AvatarView.vue"
export default {
  name: "TopNavViewAdmin",
  components: { AvatarView },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
    }),
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/actionRemoveLogIn")
      this.$router.push({ name: "login", replace: true })
    },
  },
}
</script>

<style scoped></style>
