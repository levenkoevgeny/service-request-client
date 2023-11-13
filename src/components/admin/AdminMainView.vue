<template>
  <TopNavViewAdmin />
  <div class="container-fluid">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import debounce from "lodash.debounce"
import Spinner from "@/components/common/Spinner.vue"
import { locationAPI } from "@/api/admin/locationAPI"
import TopNavViewAdmin from "@/components/common/TopNavViewAdmin.vue"

export default {
  name: "AdminMainView",
  components: { TopNavViewAdmin, Spinner },
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
