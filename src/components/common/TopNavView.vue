<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img
            class="rounded-circle"
            :src="getAvatar(userData.avatar)"
            alt=""
            width="45"
            height="45"
          />
        </a>
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
            <li class="nav-item">
              <button
                type="button"
                class="btn btn-link nav-link"
                data-bs-toggle="modal"
                data-bs-target="#personalDataModal"
                ref="updateProfileModalShowButton"
              >
                Профиль пользователя
              </button>
              <!--              <a class="nav-link" href="#">Профиль пользователя</a>-->
            </li>
            <li class="nav-item">
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

export default {
  name: "TopNavView",
  data() {
    return {
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
    }
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
    }),
  },
  methods: {
    getAvatar(uri) {
      return `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}${uri}`
    },
    logOut() {
      this.$store.dispatch("auth/actionRemoveLogIn")
      this.$router.push({ name: "login", replace: true })
    },
  },
}
</script>

<style scoped></style>
