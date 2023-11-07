<template>
  <div class="container">
    <div class="alert alert-danger" role="alert" v-if="isError">
      Ошибка приложения
    </div>
    <div class="d-flex align-items-center mb-3">
      <h5><font-awesome-icon icon="fa-solid fa-list" />&nbsp;&nbsp;</h5>
      <h3>Пользователи</h3>
    </div>
    <div>
      <button
        style="height: 40px; width: 200px"
        type="button"
        class="btn btn-primary ms-2"
        data-bs-toggle="modal"
        data-bs-target="#newServiceRequestModal"
      >
        <!--      <font-awesome-icon icon="fa-solid fa-plus" />-->
        Добавить
      </button>
    </div>

    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 80vh"
    >
      <Spinner />
    </div>

    <div v-else>
      <table class="table mt-4">
        <thead>
          <tr>
            <th scope="col">№ п.п.</th>
            <th scope="col">Username</th>
            <th scope="col">Lastname</th>
            <th scope="col">Firstname</th>
            <th scope="col">Is active</th>
            <th scope="col">Is superuser</th>
            <th scope="col">Date joined</th>
            <th scope="col">Last login</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in sortedUsersList" :key="user.id">
            <td></td>
            <td>{{ user.username }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.is_active }}</td>
            <td>{{ user.is_superuser }}</td>
            <td>{{ user.date_joined }}</td>
            <td>{{ user.last_login }}</td>
            <td>
              <button type="button" class="btn btn-secondary">
                Сменить пароль
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav>
        <ul class="pagination pagination-md">
          <li class="page-item" :class="{ disabled: !usersList.previous }">
            <button
              class="page-link"
              @click="updatePaginator(usersList.previous)"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li class="mx-2"></li>
          <li class="page-item" :class="{ disabled: !usersList.next }">
            <button class="page-link" @click="updatePaginator(usersList.next)">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import debounce from "lodash.debounce"
import Spinner from "@/components/common/Spinner.vue"
import { usersAPI } from "@/api/admin/usersAPI"

export default {
  name: "AdminUsersView",
  data() {
    return {
      usersList: { results: [] },
      isLoading: true,
      isError: false,
      newUserForm: { username: "", password: "" },
      currentUserForUpdate: null,
      usersSearchForm: {
        username: "",
        last_name: "",
        is_active: "",
        is_superuser: "",
      },
    }
  },
  methods: {
    async loadData() {
      try {
        const usersResponse = await usersAPI.getItemsList(
          this.userToken,
          this.usersSearchForm,
        )
        this.usersList = await usersResponse.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addNewUser() {},
    async updateUser(userId) {},
    async deleteSelectedUsers() {},
    async updatePassword(userId, newPassword) {},
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await usersAPI.updateList(url, this.userToken)
        this.usersList = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
  },
  async created() {
    await this.loadData()
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    sortedUsersList() {
      return this.usersList.results
    },
    selectedUsersCount() {},
  },
  watch: {},
}
</script>

<style scoped></style>
