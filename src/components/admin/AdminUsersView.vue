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
      <!--      <button-->
      <!--        style="height: 40px; width: 200px"-->
      <!--        type="button"-->
      <!--        class="btn btn-primary ms-2"-->
      <!--        data-bs-toggle="modal"-->
      <!--        data-bs-target="#newServiceRequestModal"-->
      <!--        disabled-->
      <!--      >-->
      <!--        &lt;!&ndash;      <font-awesome-icon icon="fa-solid fa-plus" />&ndash;&gt;-->
      <!--        Добавить-->
      <!--      </button>-->
    </div>

    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 80vh"
    >
      <Spinner />
    </div>

    <div v-else>
      <table class="table table-hover table-sm mt-4">
        <thead class="table-primary">
          <tr>
            <th scope="col" class="text-center">№ п.п.</th>
            <th scope="col" class="text-center">Username</th>
            <th scope="col" class="text-center">Lastname</th>
            <th scope="col" class="text-center">Firstname</th>
            <th scope="col" class="text-center">Phone number</th>
            <th scope="col" class="text-center">Is active</th>
            <th scope="col" class="text-center">Is superuser</th>
            <th scope="col" class="text-center">Date joined</th>
            <th scope="col" class="text-center">Last login</th>
            <th scope="col" class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in sortedUsersList" :key="user.id">
            <td class="text-center">
              {{ index + 1 }}
            </td>
            <td class="text-center">{{ user.username }}</td>
            <td class="text-center">{{ user.last_name }}</td>
            <td class="text-center">{{ user.first_name }}</td>
            <td class="text-center">{{ user.phone_number }}</td>
            <td class="text-center">{{ user.is_active }}</td>
            <td class="text-center">{{ user.is_superuser }}</td>
            <td class="text-center">
              {{ getFormattedDateComponent(user.date_joined) }} <br />
              {{ getFormattedTimeComponent(user.date_joined) }}
            </td>
            <td class="text-center">
              {{ getFormattedDateComponent(user.last_login) }}<br />
              {{ getFormattedTimeComponent(user.last_login) }}
            </td>
            <td class="text-center">
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
import { getFormattedDate, getFormattedTime } from "@/utils"
import TopNavView from "@/components/common/TopNavView.vue"

export default {
  name: "AdminUsersView",
  components: { TopNavView },
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
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
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
