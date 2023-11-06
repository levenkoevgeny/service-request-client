<template>
  <div class="container-fluid">
    <div class="d-flex">
      <div style="width: 300px" class="mt-3">
        <div>
          <h5>
            <router-link
              to="/admin"
              class="link-secondary"
              style="text-decoration: none"
            >
              Администрирование</router-link
            >
          </h5>
        </div>
        <ul class="list-group">
          <li class="list-group-item border-0">
            <router-link
              to="/admin/users"
              class="link-secondary"
              style="text-decoration: none"
              ><font-awesome-icon icon="fa-solid fa-user" />&nbsp;
              Пользователи</router-link
            >
          </li>
          <li class="list-group-item border-0">
            <router-link
              to="/admin/service-requests"
              class="link-secondary"
              style="text-decoration: none"
              ><font-awesome-icon icon="fa-solid fa-user" />&nbsp;
              Заявки</router-link
            >
          </li>
        </ul>
      </div>
      <div class="px-3 pt-4" style="width: 100%">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import debounce from "lodash.debounce"
import Spinner from "@/components/common/Spinner.vue"
import { locationAPI } from "@/api/admin/locationAPI"

export default {
  name: "AdminMainView",
  components: { Spinner },
  data() {
    return {
      locationList: { results: [] },
      serviceRequestList: { results: [] },
    }
  },
  async created() {},
  methods: {},
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
  watch: {},
}
</script>

<style scoped></style>
