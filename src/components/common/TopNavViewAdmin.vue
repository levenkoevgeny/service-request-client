<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/" v-if="this.userData.avatar">
          <img
            class="rounded-circle"
            :src="getAvatar(userData.avatar)"
            alt=""
            width="45"
            height="45"
          />
        </a>
        <a class="navbar-brand" href="/" v-else>
          <div
            class="rounded-circle"
            style="
              width: 45px;
              height: 45px;
              background-color: #f1aeb5;
              color: #fff3cd;
              display: flex;
              align-content: end;
              justify-content: center;
            "
          >
            <h3>{{ getUserAvatarName() }}</h3>
          </div>
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
  name: "TopNavViewAdmin",
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
    getUserAvatarName() {
      return this.userData.username[0].toUpperCase()
    },
  },
}
</script>

<style scoped></style>
