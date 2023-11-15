<template>
  <!--add new user modal-->
  <div
    class="modal fade"
    id="newUserModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div
          class="alert alert-danger"
          v-if="v$.newUserForm.$errors.length > 0"
        >
          <h5 v-if="v$.newUserForm.username.$error">Логин:</h5>
          <p v-for="error of v$.newUserForm.username.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <h5 v-if="v$.newUserForm.password.$error">Пароль:</h5>
          <p v-for="error of v$.newUserForm.password.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
          <h5 v-if="v$.newUserForm.confirmPassword.$error">Пароль (повтор):</h5>
          <p
            v-for="error of v$.newUserForm.confirmPassword.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
        </div>

        <form @submit.prevent="addNewUser">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Новый пользователь
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
                    <label class="form-label">Имя пользователя</label>
                    <input
                      type="text"
                      v-model="newUserForm.username"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Пароль</label>
                    <input
                      type="password"
                      v-model="newUserForm.password"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Повторите пароль</label>
                    <input
                      type="password"
                      v-model="newUserForm.confirmPassword"
                      class="form-control"
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
              ref="addNewUsertModalCloseButton"
            >
              Закрыть
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="newUserDataIsValid"
            >
              Создать пользователя
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!--add new user modal-->

  <!--update user modal-->
  <div
    class="modal fade"
    id="updateUserModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="userUpdate"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <form @submit.prevent="updateUser">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Редактирование данных
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
                      type="text"
                      v-model="currentUserForUpdate.last_name"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Имя</label>
                    <input
                      type="text"
                      v-model="currentUserForUpdate.first_name"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Телефон</label>
                    <input
                      type="text"
                      v-model="currentUserForUpdate.phone_number"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3 form-check">
                    <input
                      type="checkbox"
                      v-model="currentUserForUpdate.is_staff"
                      class="form-check-input"
                    />
                    <label class="form-check-label" for="exampleCheck1"
                      >Администратор</label
                    >
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3 form-check">
                    <input
                      type="checkbox"
                      v-model="currentUserForUpdate.is_active"
                      class="form-check-input"
                    />
                    <label class="form-check-label" for="exampleCheck1"
                      >Активный</label
                    >
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
              ref="updateUserModalCloseButton"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!--update user modal-->

  <!--update user password-->
  <div
    class="modal fade"
    id="updateUserPasswordModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="userPassportUpdate"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div
          class="alert alert-danger"
          v-if="v$.updateUserPasswordForm.$errors.length > 0"
        >
          <h5 v-if="v$.updateUserPasswordForm.newPassword.$error">Пароль:</h5>
          <p
            v-for="error of v$.updateUserPasswordForm.newPassword.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
          <h5 v-if="v$.updateUserPasswordForm.confirmNewPassword.$error">
            Пароль (повтор):
          </h5>
          <p
            v-for="error of v$.updateUserPasswordForm.confirmNewPassword
              .$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
        </div>
        <form @submit.prevent="updateUserPassword">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Форма смены пароля
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
                    <label class="form-label">Новый пароль</label>
                    <input
                      type="password"
                      v-model="updateUserPasswordForm.newPassword"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Повторите пароль</label>
                    <input
                      type="password"
                      v-model="updateUserPasswordForm.confirmNewPassword"
                      class="form-control"
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
              ref="updateUserPasswordModalCloseButton"
            >
              Закрыть
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="updatePasswordFormIsValid"
            >
              Обновить пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!--update user password-->

  <div class="">
    <!--    <div class="alert alert-danger" role="alert" v-if="isError">-->
    <!--      Ошибка приложения-->
    <!--    </div>-->
    <div class="d-flex align-items-center mb-3">
      <h3 class="m-4">
        <font-awesome-icon icon="fa-solid fa-users" />&nbsp;Пользователи
      </h3>
    </div>

    <div class="container">
      <div class="shadow p-3 mb-5 bg-body rounded">
        <h5 class="my-2 fs-4">Фильтр</h5>
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Имя пользователя</label>
              <input
                type="text"
                class="form-control"
                v-model="usersSearchForm.username"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Фамилия пользователя</label>
              <input
                type="text"
                class="form-control"
                v-model="usersSearchForm.last_name"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <div class="mb-3">
              <label class="form-label">Активный</label>
              <select class="form-select" v-model="usersSearchForm.is_active">
                <option value="">----</option>
                <option value="1">Да</option>
                <option value="0">Нет</option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <div class="mb-3">
              <label class="form-label">Статус персонала</label>
              <select class="form-select" v-model="usersSearchForm.is_staff">
                <option value="">----</option>
                <option value="1">Да</option>
                <option value="0">Нет</option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <div class="mb-3">
              <label class="form-label">Может быть исполнителем</label>
              <select
                class="form-select"
                v-model="usersSearchForm.can_be_executor"
              >
                <option value="">----</option>
                <option value="1">Да</option>
                <option value="0">Нет</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-end">
      <button
        style="height: 40px; width: 200px"
        type="button"
        class="btn btn-danger ms-2"
        :class="{ 'd-none': !selectedUsersCount }"
        @click="deleteCheckedUsersHandler"
      >
        Удалить - {{ selectedUsersCount }}
      </button>
      <button
        style="height: 40px; width: 200px"
        type="button"
        class="btn btn-primary ms-2"
        data-bs-toggle="modal"
        data-bs-target="#newUserModal"
      >
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
      <table class="table table-hover bg-body table-sm mt-4">
        <thead class="table-primary">
          <tr>
            <th scope="col" class="text-center">
              <input
                type="checkbox"
                class="form-check-input"
                @click="checkAllHandler($event)"
              />
            </th>
            <th scope="col" class="text-center">№ п.п.</th>
            <th scope="col" class="text-center">Имя пользователя</th>
            <th scope="col" class="text-center">Фамилия</th>
            <th scope="col" class="text-center">Имя</th>
            <th scope="col" class="text-center">Номер телефона</th>
            <th scope="col" class="text-center">Активный</th>
            <th scope="col" class="text-center">Статус персонала</th>
            <th scope="col" class="text-center">Дата создания записи</th>
            <th scope="col" class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in sortedUsersList"
            :key="user.id"
            @click="showModalForUserUpdate(user.id)"
            class="cursor-pointer"
          >
            <td class="text-center" @click.stop>
              <input
                type="checkbox"
                class="form-check-input"
                v-model="user.checked_val"
              />
            </td>
            <td class="text-center">
              {{ index + 1 }}
            </td>
            <td class="text-center">{{ user.username }}</td>
            <td class="text-center">{{ user.last_name }}</td>
            <td class="text-center">{{ user.first_name }}</td>
            <td class="text-center">{{ user.phone_number }}</td>
            <td class="text-center" v-if="user.is_active">
              <font-awesome-icon icon="fa-solid fa-check" />
            </td>
            <td class="text-center" v-else></td>
            <td class="text-center" v-if="user.is_staff">
              <font-awesome-icon icon="fa-solid fa-check" />
            </td>
            <td class="text-center" v-else></td>
            <td class="text-center">
              {{ getFormattedDateComponent(user.date_joined) }} <br />
              {{ getFormattedTimeComponent(user.date_joined) }}
            </td>
            <td
              class="text-center"
              @click.stop="showModalForPasswordUpdate(user.id)"
            >
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
import TopNavView from "@/components/common/TopNavView.vue"
import { authApi } from "@/api/auth/authAPI"
import { usersAPI } from "@/api/admin/usersAPI"
import { getFormattedDate, getFormattedTime } from "@/utils"
import useVuelidate from "@vuelidate/core"
import { required, helpers, sameAs } from "@vuelidate/validators"

export default {
  name: "AdminUsersView",
  components: { TopNavView, Spinner },
  data() {
    return {
      usersList: { results: [] },
      isLoading: true,
      isError: false,
      newUserForm: { username: "", password: "", confirmPassword: "" },
      updateUserPasswordForm: { newPassword: "", confirmNewPassword: "" },
      currentUserForUpdate: {
        last_name: "",
        first_name: "",
        phone_number: "",
        is_active: "",
        is_staff: "",
      },
      usersSearchForm: {
        username: "",
        last_name: "",
        is_active: "",
        is_superuser: "",
        can_be_executor: "",
        is_staff: "",
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
    async addNewUser() {
      if (!this.v$.$invalid) {
        this.isError = false
        this.isLoading = true
        this.$store
          .dispatch("auth/actionRegistration", { ...this.newUserForm })
          .then(() => {
            this.$refs.addNewUsertModalCloseButton.click()
            this.newUserForm = {
              username: "",
              password: "",
              confirmPassword: "",
            }
            this.isLoading = false
          })
      }
    },
    async showModalForUserUpdate(userId) {
      try {
        const response = await usersAPI.getItemData(this.userToken, userId)
        this.currentUserForUpdate = await response.data
        let updateModal = this.$refs.userUpdate
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (error) {
        this.isError = true
      } finally {
      }
    },
    async showModalForPasswordUpdate(userId) {
      try {
        const response = await usersAPI.getItemData(this.userToken, userId)
        this.currentUserForUpdate = await response.data
        let updatePasswordModal = this.$refs.userPassportUpdate
        let myModal = new bootstrap.Modal(updatePasswordModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async updateUser() {
      this.isLoading = true
      try {
        await usersAPI.updateItem(this.userToken, this.currentUserForUpdate)
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
        await this.loadData()
        this.$refs.updateUserModalCloseButton.click()
      }
    },
    async deleteCheckedUsersHandler() {
      this.isLoading = true
      this.isError = false
      let requestIds = []
      this.usersList.results.map((user) => {
        if (user.checked_val) {
          requestIds.push(user.id)
        }
        return
      })
      let requests = requestIds.map((id) =>
        usersAPI.deleteItem(this.userToken, id),
      )
      Promise.all(requests)
        .then(async () => {
          await this.loadData()
        })
        .catch(() => (this.isError = true))
        .finally(() => {
          this.isLoading = false
        })
    },
    async updateUserPassword() {
      this.isLoading = true
      try {
        await usersAPI.updatePassword(
          this.userToken,
          this.currentUserForUpdate.id,
          { password: this.updateUserPasswordForm.newPassword },
        )
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
        this.$refs.updateUserPasswordModalCloseButton.click()
      }
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 100),
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
    checkAllHandler(e) {
      if (e.target.checked) {
        this.usersList.results = this.usersList.results.map((user) => ({
          ...user,
          checked_val: true,
        }))
      } else {
        this.usersList.results = this.usersList.results.map((user) => ({
          ...user,
          checked_val: false,
        }))
      }
    },
  },
  async created() {
    await this.loadData()
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    const passwordRegex = helpers.regex(
      /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/,
    )
    const loginRegex = helpers.regex(/^[a-zA-Z\d]*$/)
    const same = sameAs(this.newUserForm.password)
    const sameUpdate = sameAs(this.updateUserPasswordForm.newPassword)
    const isUserNameTaken = helpers.withAsync(async (value) => {
      if (value === "") return true
      const response = await authApi.getUserNames(value)
      return response.data.results.length <= 0
    })

    return {
      newUserForm: {
        username: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          isUnique: helpers.withMessage(
            "Пользователь с таким именем уже присутствует в системе",
            isUserNameTaken,
          ),
          loginRegex: helpers.withMessage(
            "Допускаются только латинские буквы",
            loginRegex,
          ),
          $autoDirty: true,
        },
        password: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          passwordRegex: helpers.withMessage(
            "Пароль не удовлетворяет минимальным требованиям безопасности (пароль должен состоять из не менее 6 символов в которых должны присутствовать строчные, прописные буквы, цифры, спецсимволы)",
            passwordRegex,
          ),
          $autoDirty: true,
        },
        confirmPassword: {
          $autoDirty: true,
          same: helpers.withMessage("Введенные пароли не совпадают", same),
        },
      },
      updateUserPasswordForm: {
        newPassword: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          passwordRegex: helpers.withMessage(
            "Пароль не удовлетворяет минимальным требованиям безопасности (пароль должен состоять из не менее 6 символов в которых должны присутствовать строчные, прописные буквы, цифры, спецсимволы)",
            passwordRegex,
          ),
          $autoDirty: true,
        },
        confirmNewPassword: {
          $autoDirty: true,
          same: helpers.withMessage(
            "Введенные пароли не совпадают",
            sameUpdate,
          ),
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    newUserDataIsValid: function () {
      return this.v$.newUserForm.$invalid
    },
    updatePasswordFormIsValid: function () {
      return this.v$.updateUserPasswordForm.$invalid
    },
    sortedUsersList() {
      return this.usersList.results
    },
    selectedUsersCount() {
      let counter = 0
      this.usersList.results.map((user) => {
        if (user.checked_val) {
          counter++
        }
      })
      return counter
    },
  },
  watch: {
    usersSearchForm: {
      handler(newValue, oldValue) {
        this.debouncedSearch()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
