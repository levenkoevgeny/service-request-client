<template>
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
</template>

<script>
export default {
  name: "AvatarView",
  props: {
    userData: Object,
  },
  data() {
    return {
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
    }
  },
  methods: {
    getAvatar(uri) {
      return `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}${uri}`
    },
    getDefaultAvatarText() {
      return this.userData.username[0].toUpperCase()
    },
  },
}
</script>
