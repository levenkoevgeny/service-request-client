<template>
  <div class="container">
    <div class="d-flex align-items-center mb-3">
      <h5>Заявки <font-awesome-icon icon="fa-solid fa-list" />&nbsp;&nbsp;</h5>
      <h3></h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminServiceRequestsView",
  data() {
    return {
      usersList: { results: [] },
      isLoading: true,
      isError: false,
      newUserForm: { username: "", password: "" },
      currentUserForUpdate: null,
    }
  },
  methods: {},
  async created() {},
  computed: {},
  watch: {},
}
</script>

<style scoped></style>
