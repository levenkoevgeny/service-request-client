<template>
  <div
    class="modal fade"
    id="personalDataModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel2"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <form @submit.prevent="updateProfileHandler">
          <div
            class="modal-header"
            style="background-color: #3a8ecb; color: #dee2e6"
          >
            <h5 class="modal-title" id="exampleModalLabel">
              Обновление данных профиля
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Фамилия</label>
                    <input
                      class="form-control"
                      type="text"
                      v-model="currentUser.last_name"
                      name="last_name"
                      @input="updateCurrentUserData"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Имя</label>
                    <input
                      class="form-control"
                      type="text"
                      v-model="currentUser.first_name"
                      name="first_name"
                      @input="updateCurrentUserData"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Телефон</label>
                    <input
                      class="form-control"
                      type="text"
                      v-model="currentUser.phone_number"
                      name="phone_number"
                      @input="updateCurrentUserData"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="updateProfileModalCloseButton"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div>
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light"
      style="background-color: #ffffff !important"
    >
      <div class="container-fluid">
        <a
          class="navbar-brand"
          :title="this.userData.username"
          href="/"
          v-if="this.userData.avatar"
        >
          <img
            class="rounded-circle ms-5"
            :src="getAvatar(userData.avatar)"
            alt=""
            width="70"
            height="70"
          />
        </a>
        <a class="navbar-brand" :title="this.userData.username" href="/" v-else>
          <div
            class="rounded-circle d-flex justify-content-center align-items-center default-avatar"
          >
            <p class="m-0 p-0 fs-3">
              {{ getDefaultAvatarText() }}
            </p>
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
            <li class="nav-item fs-5">
              <a class="nav-link" href="/">Мои заявки</a>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class="btn btn-link nav-link fs-5"
                data-bs-toggle="modal"
                data-bs-target="#personalDataModal"
                ref="updateProfileModalShowButton"
              >
                Профиль пользователя
              </button>
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
import { mapGetters, mapState } from "vuex"

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
    ...mapState({
      currentUser: (state) => state.auth.user,
    }),
  },
  methods: {
    updateCurrentUserData(e) {
      const fieldName = e.target.name
      this.$store.commit("auth/setUserData", {
        ...this.userData,
        [fieldName]: e.target.value,
      })
    },
    async updateProfileHandler(e) {
      e.preventDefault()
      e.stopPropagation()
      this.$store.dispatch("auth/updateUserData").then(() => {
        this.$refs.updateProfileModalCloseButton.click()
        this.$router.replace({ name: "client-main" })
      })
    },
    getAvatar(uri) {
      return `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}${uri}`
    },
    logOut() {
      this.$store.dispatch("auth/actionRemoveLogIn")
      this.$router.push({ name: "login", replace: true })
    },
    getDefaultAvatarText() {
      return this.userData.username[0].toUpperCase()
    },
  },
}
</script>

<style scoped></style>
